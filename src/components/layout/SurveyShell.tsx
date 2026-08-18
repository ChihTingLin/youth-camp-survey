import type { PropsWithChildren } from 'react'

import { useSurvey } from '../../app/surveyContext'
import { QUESTION_IDS } from '../../types/survey'
import { Landscape } from './Landscape'
import { NavigationControls } from './NavigationControls'
import { ProgressHeader } from './ProgressHeader'

const TOTAL_QUESTIONS = QUESTION_IDS.length

export function SurveyShell({ children }: PropsWithChildren) {
  const { state, dispatch, submission } = useSurvey()
  const questionIndex = QUESTION_IDS.findIndex((id) => id === state.screen)
  const phase =
    state.screen === 'profile'
      ? 'profile'
      : state.screen === 'complete'
        ? 'complete'
        : 'question'
  const current =
    phase === 'profile'
      ? 0
      : phase === 'complete'
        ? TOTAL_QUESTIONS
        : questionIndex + 1
  const landscapeProgress = current / TOTAL_QUESTIONS
  const isLastQuestion = state.screen === QUESTION_IDS.at(-1)
  const landscapeVariant =
    state.screen === 'psychologicalEnergy'
      ? 'lake'
      : state.screen === 'bodySignals'
        ? 'body'
        : state.screen === 'campExpectation'
          ? 'writing'
          : state.screen === 'physicalEnergy'
            ? 'energy'
            : 'trail'

  return (
    <div className="survey-shell relative isolate overflow-x-hidden bg-[radial-gradient(circle_at_74%_15%,rgba(239,189,103,0.16),transparent_25%),linear-gradient(180deg,#fbf6ee_0%,#f7f1e7_58%,#e5e3ca_100%)]">
      <Landscape progress={landscapeProgress} variant={landscapeVariant} />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {phase === 'profile'
          ? '行前資料'
          : phase === 'complete'
            ? '問卷完成'
            : `第 ${current} 題，共 ${TOTAL_QUESTIONS} 題`}
      </p>

      <div className="survey-page relative z-10 mx-auto flex w-full max-w-6xl flex-col">
        <ProgressHeader
          current={current}
          total={TOTAL_QUESTIONS}
          phase={phase}
        />

        <main
          id="survey-content"
          className="survey-main flex flex-1 items-stretch pt-10 pb-8 sm:pt-16 lg:pt-20"
        >
          {children}
        </main>

        <div className="relative z-20 mt-auto">
          <div className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 items-center gap-3 whitespace-nowrap text-sm tracking-[0.12em] text-white/85 md:flex">
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.4 7 13 7 13s7-7.6 7-13a7 7 0 0 0-7-7Zm0 10.2A3.2 3.2 0 1 1 12 5.8a3.2 3.2 0 0 1 0 6.4Z" />
            </svg>
            覺察，是改變的第一步
          </div>

          <NavigationControls
            nextLabel={
              state.screen === 'profile'
                ? '開始探索'
                : isLastQuestion
                  ? '完成問卷'
                  : '下一題'
            }
            onBack={() =>
              state.screen === 'complete'
                ? submission.editAnswers()
                : dispatch({ type: 'navigation/back' })
            }
            onNext={() => dispatch({ type: 'navigation/next' })}
            showBack={
              state.screen !== 'profile' &&
              !(
                state.screen === 'complete' &&
                submission.status !== 'failed'
              )
            }
            showNext={state.screen !== 'complete'}
          />
        </div>
      </div>
    </div>
  )
}
