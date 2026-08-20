import type { SurveyState } from '../types/survey'

const SUBMISSION_TIMEOUT_MS = 20_000

export interface SurveySubmissionPayload {
  submissionId: string
  schemaVersion: SurveyState['schemaVersion']
  profile: SurveyState['profile']
  answers: SurveyState['answers']
}

interface SuccessfulSubmissionResponse {
  ok: true
  duplicate: boolean
  submissionId: string
}

interface FailedSubmissionResponse {
  ok: false
  error: string
  message: string
}

type SubmissionResponse =
  | SuccessfulSubmissionResponse
  | FailedSubmissionResponse

export class SurveySubmissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SurveySubmissionError'
  }
}

export async function submitSurvey(
  payload: SurveySubmissionPayload,
): Promise<SuccessfulSubmissionResponse> {
  const endpoint = import.meta.env.VITE_GOOGLE_SCRIPT_URL
  if (!endpoint) {
    throw new SurveySubmissionError('尚未設定問卷送出網址。')
  }

  const timeoutController = new AbortController()
  const timeoutId = window.setTimeout(
    () => timeoutController.abort(),
    SUBMISSION_TIMEOUT_MS,
  )

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        // Apps Script ContentService responds through a cross-origin redirect.
        // An opaque request avoids treating its successful 302 flow as a CORS error.
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: timeoutController.signal,
    })

    if (response.type === 'opaque') {
      return {
        ok: true,
        duplicate: false,
        submissionId: payload.submissionId,
      }
    }

    if (!response.ok) {
      throw new SurveySubmissionError('送出服務暫時無法使用，請稍後再試。')
    }

    const result = (await response.json()) as SubmissionResponse
    if (!isSubmissionResponse(result)) {
      throw new SurveySubmissionError('送出服務回傳了無法辨識的結果。')
    }

    if (!result.ok) {
      throw new SurveySubmissionError('答案格式未通過檢查，請返回確認後再試。')
    }

    if (result.submissionId !== payload.submissionId) {
      throw new SurveySubmissionError('送出確認資料不一致，請稍後再試。')
    }

    return result
  } catch (error) {
    if (error instanceof SurveySubmissionError) throw error

    if (timeoutController.signal.aborted) {
      throw new SurveySubmissionError('連線等候逾時；答案仍保留在這台裝置上。')
    }

    throw new SurveySubmissionError('目前無法連線；答案仍保留在這台裝置上。')
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function isSubmissionResponse(value: unknown): value is SubmissionResponse {
  if (!value || typeof value !== 'object' || !('ok' in value)) return false

  if (value.ok === true) {
    return (
      'duplicate' in value &&
      typeof value.duplicate === 'boolean' &&
      'submissionId' in value &&
      typeof value.submissionId === 'string'
    )
  }

  return (
    value.ok === false &&
    'error' in value &&
    typeof value.error === 'string' &&
    'message' in value &&
    typeof value.message === 'string'
  )
}
