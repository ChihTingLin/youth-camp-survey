import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import {
  clearSurveyDraft,
  getBrowserStorage,
  loadSurveyDraft,
  saveSurveyDraft,
} from '../app/surveyPersistence'
import { surveyReducer } from '../app/surveyReducer'
import {
  submitSurvey,
  SurveySubmissionError,
} from '../app/surveySubmission'

const SUBMISSION_ID_STORAGE_KEY = 'young-camp-survey:submission-id'

type SubmissionState =
  | { status: 'idle'; error: null }
  | { status: 'submitting'; error: null }
  | { status: 'succeeded'; error: null }
  | { status: 'failed'; error: string }

export function usePersistedSurvey() {
  const storage = getBrowserStorage()
  const [state, dispatch] = useReducer(
    surveyReducer,
    storage,
    loadSurveyDraft,
  )
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: 'idle',
    error: null,
  })
  const submissionId = useRef<string | null>(null)
  const attemptStarted = useRef(false)
  const requestPending = useRef(false)

  useEffect(() => {
    saveSurveyDraft(state, storage)
  }, [state, storage])

  const submit = useCallback(async () => {
    if (requestPending.current) return

    const currentSubmissionId =
      submissionId.current ?? getOrCreateSubmissionId()
    submissionId.current = currentSubmissionId
    attemptStarted.current = true
    requestPending.current = true
    setSubmissionState({ status: 'submitting', error: null })

    try {
      await submitSurvey({
        submissionId: currentSubmissionId,
        schemaVersion: state.schemaVersion,
        profile: state.profile,
        answers: state.answers,
      })
      clearSurveyDraft(storage)
      clearSubmissionId()
      submissionId.current = null
      setSubmissionState({ status: 'succeeded', error: null })
    } catch (error) {
      setSubmissionState({
        status: 'failed',
        error:
          error instanceof SurveySubmissionError
            ? error.message
            : '送出時發生問題；答案仍保留在這台裝置上。',
      })
    } finally {
      requestPending.current = false
    }
  }, [state, storage])

  useEffect(() => {
    if (state.screen !== 'complete') {
      attemptStarted.current = false
      return
    }

    if (submissionState.status !== 'idle' || attemptStarted.current) return
    void submit()
  }, [state.screen, submissionState.status, submit])

  const retry = useCallback(() => {
    void submit()
  }, [submit])

  const editAnswers = useCallback(() => {
    attemptStarted.current = false
    setSubmissionState({ status: 'idle', error: null })
    dispatch({ type: 'navigation/back' })
  }, [])

  const startOver = useCallback(() => {
    clearSurveyDraft(storage)
    clearSubmissionId()
    submissionId.current = null
    attemptStarted.current = false
    setSubmissionState({ status: 'idle', error: null })
    dispatch({ type: 'survey/reset' })
  }, [storage])

  return {
    state,
    dispatch,
    submission: {
      ...submissionState,
      retry,
      editAnswers,
      startOver,
    },
  }
}

function getOrCreateSubmissionId(): string {
  try {
    const existingId = window.localStorage.getItem(SUBMISSION_ID_STORAGE_KEY)
    if (existingId) return existingId

    const submissionId = createSubmissionId()
    window.localStorage.setItem(SUBMISSION_ID_STORAGE_KEY, submissionId)
    return submissionId
  } catch {
    return createSubmissionId()
  }
}

function clearSubmissionId(): void {
  try {
    window.localStorage.removeItem(SUBMISSION_ID_STORAGE_KEY)
  } catch {
    // An unavailable storage area does not prevent resetting in-memory state.
  }
}

function createSubmissionId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
