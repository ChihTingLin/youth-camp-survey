import { validateScreen } from './surveyValidation'
import {
  DEFAULT_SCALE_VALUE,
  QUESTION_IDS,
  SURVEY_SCHEMA_VERSION,
  type AnswerChangedAction,
  type SurveyAction,
  type SurveyAnswers,
  type SurveyScreen,
  type SurveyState,
} from '../types/survey'

export const SURVEY_FLOW: readonly SurveyScreen[] = [
  'profile',
  ...QUESTION_IDS,
  'complete',
]

export function createInitialSurveyState(): SurveyState {
  return {
    schemaVersion: SURVEY_SCHEMA_VERSION,
    screen: 'profile',
    navigationDirection: 1,
    profile: {
      group: '',
      gender: null,
      name: '',
    },
    answers: {
      focusAreas: {
        selections: [],
        other: '',
      },
      recentMood: {
        selections: [],
        other: '',
      },
      physicalEnergy: DEFAULT_SCALE_VALUE,
      psychologicalEnergy: DEFAULT_SCALE_VALUE,
      bodySignals: {
        selections: [],
        other: '',
      },
      campExpectation: '',
    },
    validationErrors: {},
  }
}

export function surveyReducer(
  state: SurveyState,
  action: SurveyAction,
): SurveyState {
  switch (action.type) {
    case 'profile/changed':
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.field]: action.value,
        },
        validationErrors: clearValidationError(
          state.validationErrors,
          action.field,
        ),
      }
    case 'answer/changed':
      return {
        ...state,
        answers: updateAnswer(state.answers, action),
        validationErrors: clearValidationError(
          state.validationErrors,
          action.questionId,
        ),
      }
    case 'navigation/next': {
      const validationErrors = validateScreen(state.screen, state)
      if (Object.keys(validationErrors).length > 0) {
        return { ...state, validationErrors }
      }

      return {
        ...state,
        screen: getAdjacentScreen(state.screen, 1),
        navigationDirection: 1,
        validationErrors: {},
      }
    }
    case 'navigation/back':
      return {
        ...state,
        screen: getAdjacentScreen(state.screen, -1),
        navigationDirection: -1,
        validationErrors: {},
      }
    case 'survey/reset':
      return createInitialSurveyState()
  }
}

function updateAnswer(
  answers: SurveyAnswers,
  action: AnswerChangedAction,
): SurveyAnswers {
  switch (action.questionId) {
    case 'focusAreas':
      return { ...answers, focusAreas: action.value }
    case 'recentMood':
      return { ...answers, recentMood: action.value }
    case 'physicalEnergy':
      return { ...answers, physicalEnergy: action.value }
    case 'psychologicalEnergy':
      return { ...answers, psychologicalEnergy: action.value }
    case 'bodySignals':
      return { ...answers, bodySignals: action.value }
    case 'campExpectation':
      return { ...answers, campExpectation: action.value }
  }
}

function clearValidationError(
  errors: SurveyState['validationErrors'],
  field: keyof SurveyState['validationErrors'],
): SurveyState['validationErrors'] {
  const nextErrors = { ...errors }
  delete nextErrors[field]
  return nextErrors
}

function getAdjacentScreen(
  currentScreen: SurveyScreen,
  offset: -1 | 1,
): SurveyScreen {
  const currentIndex = SURVEY_FLOW.indexOf(currentScreen)
  const nextIndex = Math.min(
    SURVEY_FLOW.length - 1,
    Math.max(0, currentIndex + offset),
  )

  return SURVEY_FLOW[nextIndex] ?? 'profile'
}
