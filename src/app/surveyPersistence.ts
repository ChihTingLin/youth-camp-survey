import { createInitialSurveyState, SURVEY_FLOW } from './surveyReducer'
import {
  BODY_SIGNAL_IDS,
  DEFAULT_SCALE_VALUE,
  FOCUS_AREA_IDS,
  MOOD_IDS,
  SURVEY_SCHEMA_VERSION,
  type SurveyScreen,
  type SurveyState,
} from '../types/survey'

export const SURVEY_STORAGE_KEY = 'youth-camp-survey:draft'

interface PersistedSurveyDraft {
  schemaVersion: number
  savedAt: string
  state: SurveyState
}

type StorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function getBrowserStorage(): StorageAdapter | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function loadSurveyDraft(
  storage: StorageAdapter | null = getBrowserStorage(),
): SurveyState {
  if (!storage) {
    return createInitialSurveyState()
  }

  try {
    const serializedDraft = storage.getItem(SURVEY_STORAGE_KEY)
    if (!serializedDraft) {
      return createInitialSurveyState()
    }

    return parseSurveyDraft(JSON.parse(serializedDraft))
  } catch {
    return createInitialSurveyState()
  }
}

export function saveSurveyDraft(
  state: SurveyState,
  storage: StorageAdapter | null = getBrowserStorage(),
): void {
  if (!storage) return

  const draft: PersistedSurveyDraft = {
    schemaVersion: SURVEY_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    state: {
      ...state,
      validationErrors: {},
    },
  }

  try {
    storage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // A full or unavailable storage area should not block the questionnaire.
  }
}

export function clearSurveyDraft(
  storage: StorageAdapter | null = getBrowserStorage(),
): void {
  try {
    storage?.removeItem(SURVEY_STORAGE_KEY)
  } catch {
    // Resetting in-memory state still works when storage is unavailable.
  }
}

function parseSurveyDraft(value: unknown): SurveyState {
  const initialState = createInitialSurveyState()
  if (
    !isRecord(value) ||
    (value.schemaVersion !== 1 && value.schemaVersion !== SURVEY_SCHEMA_VERSION)
  ) {
    return initialState
  }

  const persistedState = isRecord(value.state) ? value.state : null
  if (!persistedState) {
    return initialState
  }

  const profile = isRecord(persistedState.profile)
    ? persistedState.profile
    : {}
  const answers = isRecord(persistedState.answers)
    ? persistedState.answers
    : {}
  const bodySignals = isRecord(answers.bodySignals) ? answers.bodySignals : {}
  const focusAreas = isRecord(answers.focusAreas) ? answers.focusAreas : null
  const recentMood = isRecord(answers.recentMood) ? answers.recentMood : null

  return {
    schemaVersion: SURVEY_SCHEMA_VERSION,
    screen: isSurveyScreen(persistedState.screen)
      ? persistedState.screen
      : initialState.screen,
    navigationDirection: persistedState.navigationDirection === -1 ? -1 : 1,
    profile: {
      group: asString(profile.group),
      name: asString(profile.name),
    },
    answers: {
      focusAreas: {
        selections: filterStringIds(
          focusAreas?.selections ?? answers.focusAreas,
          FOCUS_AREA_IDS,
        ),
        other: asString(focusAreas?.other),
      },
      recentMood: {
        selection: isStringId(
          recentMood?.selection ?? answers.recentMood,
          MOOD_IDS,
        )
          ? (recentMood?.selection ?? answers.recentMood) as SurveyState['answers']['recentMood']['selection']
          : null,
        other: asString(recentMood?.other),
      },
      physicalEnergy: asScaleAnswer(answers.physicalEnergy),
      psychologicalEnergy: asScaleAnswer(answers.psychologicalEnergy),
      bodySignals: {
        selections: filterStringIds(bodySignals.selections, BODY_SIGNAL_IDS),
        other: asString(bodySignals.other),
      },
      campExpectation: asString(answers.campExpectation),
    },
    validationErrors: {},
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asScaleAnswer(value: unknown): number {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 10
    ? Number(value)
    : DEFAULT_SCALE_VALUE
}

function isSurveyScreen(value: unknown): value is SurveyScreen {
  return typeof value === 'string' && SURVEY_FLOW.includes(value as SurveyScreen)
}

function isStringId<const Id extends string>(
  value: unknown,
  allowedIds: readonly Id[],
): value is Id {
  return typeof value === 'string' && allowedIds.includes(value as Id)
}

function filterStringIds<const Id extends string>(
  value: unknown,
  allowedIds: readonly Id[],
): Id[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Id => isStringId(item, allowedIds))
}
