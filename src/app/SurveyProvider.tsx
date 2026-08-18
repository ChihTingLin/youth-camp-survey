import type { PropsWithChildren } from 'react'

import { usePersistedSurvey } from '../hooks/usePersistedSurvey'
import { SurveyContext } from './surveyContext'

export function SurveyProvider({ children }: PropsWithChildren) {
  const survey = usePersistedSurvey()

  return <SurveyContext value={survey}>{children}</SurveyContext>
}
