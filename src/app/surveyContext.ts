import { createContext, useContext } from 'react'

import type { usePersistedSurvey } from '../hooks/usePersistedSurvey'

export type SurveyContextValue = ReturnType<typeof usePersistedSurvey>

export const SurveyContext = createContext<SurveyContextValue | null>(null)

export function useSurvey(): SurveyContextValue {
  const context = useContext(SurveyContext)

  if (!context) {
    throw new Error('useSurvey must be used within SurveyProvider')
  }

  return context
}
