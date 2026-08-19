export const SURVEY_SCHEMA_VERSION = 3 as const
export const DEFAULT_SCALE_VALUE = 6

export const GROUP_VALUES = [
  '第一組',
  '第二組',
  '第三組',
  '第四組',
  '第五組',
  '第六組',
] as const

export type GroupValue = (typeof GROUP_VALUES)[number]

export const GENDER_IDS = [
  'male',
  'female',
  'nonBinaryOrOther',
  'preferNotToSay',
] as const

export type GenderId = (typeof GENDER_IDS)[number]

export const QUESTION_IDS = [
  'focusAreas',
  'recentMood',
  'physicalEnergy',
  'psychologicalEnergy',
  'bodySignals',
  'campExpectation',
] as const

export type QuestionId = (typeof QUESTION_IDS)[number]

export const FOCUS_AREA_IDS = [
  'work',
  'finances',
  'family',
  'relationships',
  'health',
  'futureDirection',
  'selfGrowth',
  'other',
] as const

export type FocusAreaId = (typeof FOCUS_AREA_IDS)[number]

export const MOOD_IDS = [
  'busy',
  'anxious',
  'empty',
  'pressured',
  'drained',
  'lost',
  'stable',
  'fulfilled',
  'hopeful',
  'other',
] as const

export type MoodId = (typeof MOOD_IDS)[number]

export const BODY_SIGNAL_IDS = [
  'shoulderTension',
  'chestTightness',
  'stomachDiscomfort',
  'headache',
  'poorSleep',
  'fatigue',
  'mentalTension',
  'relaxed',
  'noSpecialFeeling',
] as const

export type BodySignalId = (typeof BODY_SIGNAL_IDS)[number]

export interface ParticipantProfile {
  group: GroupValue | ''
  gender: GenderId | null
  name: string
}

export interface FocusAreasAnswer {
  selections: FocusAreaId[]
  other: string
}

export interface RecentMoodAnswer {
  selection: MoodId | null
  other: string
}

export interface BodySignalsAnswer {
  selections: BodySignalId[]
  other: string
}

export interface SurveyAnswers {
  focusAreas: FocusAreasAnswer
  recentMood: RecentMoodAnswer
  physicalEnergy: number
  psychologicalEnergy: number
  bodySignals: BodySignalsAnswer
  campExpectation: string
}

export type SurveyScreen = 'profile' | QuestionId | 'complete'
export type SurveyFieldId = keyof ParticipantProfile | QuestionId
export type ValidationErrors = Partial<Record<SurveyFieldId, string>>

export interface SurveyState {
  schemaVersion: typeof SURVEY_SCHEMA_VERSION
  screen: SurveyScreen
  navigationDirection: -1 | 1
  profile: ParticipantProfile
  answers: SurveyAnswers
  validationErrors: ValidationErrors
}

export type AnswerChangedAction = {
  [Id in QuestionId]: {
    type: 'answer/changed'
    questionId: Id
    value: SurveyAnswers[Id]
  }
}[QuestionId]

export type ProfileChangedAction = {
  [Field in keyof ParticipantProfile]: {
    type: 'profile/changed'
    field: Field
    value: ParticipantProfile[Field]
  }
}[keyof ParticipantProfile]

export type SurveyAction =
  | ProfileChangedAction
  | AnswerChangedAction
  | { type: 'navigation/next' }
  | { type: 'navigation/back' }
  | { type: 'survey/reset' }
