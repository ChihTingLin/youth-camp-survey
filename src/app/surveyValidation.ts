import {
  GENDER_IDS,
  GROUP_VALUES,
  type QuestionId,
  type SurveyAnswers,
  type SurveyScreen,
  type SurveyState,
  type ValidationErrors,
} from '../types/survey'

const PROFILE_MAX_LENGTH = 80
const OTHER_CHOICE_MAX_LENGTH = 300
const OTHER_BODY_SIGNAL_MAX_LENGTH = 300
const CAMP_EXPECTATION_MAX_LENGTH = 2000

export function validateProfile(
  profile: SurveyState['profile'],
): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!profile.group || !GROUP_VALUES.includes(profile.group)) {
    errors.group = '請選擇組別。'
  }

  if (!profile.gender || !GENDER_IDS.includes(profile.gender)) {
    errors.gender = '請選擇性別。'
  }

  if (profile.name.trim().length > PROFILE_MAX_LENGTH) {
    errors.name = `姓名不可超過 ${PROFILE_MAX_LENGTH} 個字。`
  }

  return errors
}

export function validateQuestion<Id extends QuestionId>(
  questionId: Id,
  answer: SurveyAnswers[Id],
): ValidationErrors {
  switch (questionId) {
    case 'focusAreas':
      return validateChoiceWithOther(
        answer as SurveyAnswers['focusAreas'],
        'focusAreas',
        '請至少選擇一個項目。',
      )
    case 'recentMood': {
      const recentMood = answer as SurveyAnswers['recentMood']
      if (recentMood.selection === null) {
        return { recentMood: '請選擇一個最接近的心情。' }
      }

      if (recentMood.other.trim().length > OTHER_CHOICE_MAX_LENGTH) {
        return { recentMood: `其他內容不可超過 ${OTHER_CHOICE_MAX_LENGTH} 個字。` }
      }

      return recentMood.selection === 'other' && recentMood.other.trim().length === 0
        ? { recentMood: '請告訴我們「其他」是什麼。' }
        : {}
    }
    case 'physicalEnergy':
    case 'psychologicalEnergy':
      return isValidScaleAnswer(answer)
        ? {}
        : { [questionId]: '請選擇 1 到 10 之間的整數。' }
    case 'bodySignals': {
      const bodySignals = answer as SurveyAnswers['bodySignals']
      if (bodySignals.other.trim().length > OTHER_BODY_SIGNAL_MAX_LENGTH) {
        return {
          bodySignals: `其他感覺不可超過 ${OTHER_BODY_SIGNAL_MAX_LENGTH} 個字。`,
        }
      }

      return bodySignals.selections.length > 0 || bodySignals.other.trim().length > 0
        ? {}
        : { bodySignals: '請至少選擇或填寫一種身體狀態。' }
    }
    case 'campExpectation': {
      const expectation = (answer as string).trim()
      return expectation.length <= CAMP_EXPECTATION_MAX_LENGTH
        ? {}
        : {
            campExpectation: `回答不可超過 ${CAMP_EXPECTATION_MAX_LENGTH} 個字。`,
          }
    }
  }
}

function validateChoiceWithOther(
  answer: SurveyAnswers['focusAreas'],
  field: 'focusAreas',
  emptyMessage: string,
): ValidationErrors {
  if (answer.selections.length === 0) {
    return { [field]: emptyMessage }
  }

  if (answer.other.trim().length > OTHER_CHOICE_MAX_LENGTH) {
    return { [field]: `其他內容不可超過 ${OTHER_CHOICE_MAX_LENGTH} 個字。` }
  }

  return answer.selections.includes('other') && answer.other.trim().length === 0
    ? { [field]: '請告訴我們「其他」是什麼。' }
    : {}
}

export function validateScreen(
  screen: SurveyScreen,
  state: SurveyState,
): ValidationErrors {
  if (screen === 'profile') {
    return validateProfile(state.profile)
  }

  if (screen === 'complete') {
    return {}
  }

  return validateQuestion(screen, state.answers[screen])
}

function isValidScaleAnswer(answer: unknown): answer is number {
  return Number.isInteger(answer) && Number(answer) >= 1 && Number(answer) <= 10
}
