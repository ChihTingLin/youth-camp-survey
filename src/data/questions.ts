import type {
  BodySignalId,
  FocusAreaId,
  MoodId,
  QuestionId,
} from '../types/survey'

interface QuestionOption<Id extends string> {
  id: Id
  label: string
}

interface BaseQuestionDefinition<Id extends QuestionId> {
  id: Id
  eyebrow: string
  title: string
  description: string
  required: boolean
}

interface ChoiceQuestionDefinition<
  Id extends QuestionId,
  OptionId extends string,
> extends BaseQuestionDefinition<Id> {
  kind: 'multi-select' | 'single-select' | 'multi-select-with-other'
  options: readonly QuestionOption<OptionId>[]
}

interface ScaleQuestionDefinition<Id extends QuestionId>
  extends BaseQuestionDefinition<Id> {
  kind: 'scale'
  min: 1
  max: 10
  defaultValue: 6
}

interface TextQuestionDefinition<Id extends QuestionId>
  extends BaseQuestionDefinition<Id> {
  kind: 'text'
  maxLength: number
}

export type SurveyQuestionDefinition =
  | ChoiceQuestionDefinition<'focusAreas', FocusAreaId>
  | ChoiceQuestionDefinition<'recentMood', MoodId>
  | ScaleQuestionDefinition<'physicalEnergy'>
  | ScaleQuestionDefinition<'psychologicalEnergy'>
  | ChoiceQuestionDefinition<'bodySignals', BodySignalId>
  | TextQuestionDefinition<'campExpectation'>

export const QUESTIONS = [
  {
    id: 'focusAreas',
    kind: 'multi-select',
    eyebrow: '過去半年，',
    title: '最常佔據你腦海的是？',
    description: '可複選。',
    required: true,
    options: [
      { id: 'work', label: '工作' },
      { id: 'finances', label: '經濟' },
      { id: 'family', label: '家庭' },
      { id: 'relationships', label: '感情' },
      { id: 'health', label: '健康' },
      { id: 'futureDirection', label: '未來方向' },
      { id: 'selfGrowth', label: '自我成長' },
      { id: 'other', label: '其他' },
    ],
  },
  {
    id: 'recentMood',
    kind: 'single-select',
    eyebrow: '最近半年，',
    title: '您最常感受到的是？',
    description: '選一個最貼近你最近的心情。',
    required: true,
    options: [
      { id: 'busy', label: '忙碌' },
      { id: 'anxious', label: '焦慮' },
      { id: 'empty', label: '空虛' },
      { id: 'pressured', label: '壓力' },
      { id: 'drained', label: '無力' },
      { id: 'lost', label: '迷惘' },
      { id: 'stable', label: '穩定' },
      { id: 'fulfilled', label: '充實' },
      { id: 'hopeful', label: '期待' },
      { id: 'other', label: '其他' },
    ],
  },
  {
    id: 'physicalEnergy',
    kind: 'scale',
    eyebrow: '過去幾週，',
    title: '你的身體能量水平是？',
    description: '用 1–10 分描述你最近的身體電量。',
    required: true,
    min: 1,
    max: 10,
    defaultValue: 6,
  },
  {
    id: 'psychologicalEnergy',
    kind: 'scale',
    eyebrow: '過去幾週，',
    title: '您的心理能量水平（1–10 分）？',
    description: '也就是你的心理狀態、情緒韌性與內在穩定感。',
    required: true,
    min: 1,
    max: 10,
    defaultValue: 6,
  },
  {
    id: 'bodySignals',
    kind: 'multi-select-with-other',
    eyebrow: '您觀察自己',
    title: '整體最明顯的身體狀態是？',
    description: '可複選，也可以寫下其他感覺。',
    required: true,
    options: [
      { id: 'shoulderTension', label: '肩膀緊繃' },
      { id: 'chestTightness', label: '胸口悶' },
      { id: 'stomachDiscomfort', label: '胃不舒服' },
      { id: 'headache', label: '頭痛' },
      { id: 'poorSleep', label: '睡不好' },
      { id: 'fatigue', label: '疲憊' },
      { id: 'mentalTension', label: '思緒緊繃' },
      { id: 'relaxed', label: '輕鬆自在' },
      { id: 'noSpecialFeeling', label: '沒有特別感覺' },
    ],
  },
  {
    id: 'campExpectation',
    kind: 'text',
    eyebrow: '你希望在這趟營隊旅程中，',
    title: '獲得什麼幫助或調整？',
    description: '沒有標準答案，寫下此刻最真實的期待就好。',
    required: false,
    maxLength: 2000,
  },
] as const satisfies readonly SurveyQuestionDefinition[]
