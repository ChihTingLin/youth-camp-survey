import { useSurvey } from '../../app/surveyContext'
import { QUESTIONS } from '../../data/questions'
import { PaperNote } from '../visuals/PaperNote'
import { BodyMapQuestion } from './BodyMapQuestion'
import { MultiSelectQuestion } from './MultiSelectQuestion'
import { ScaleQuestion } from './ScaleQuestion'
import { TextQuestion } from './TextQuestion'

export function QuestionInteraction() {
  const { state, dispatch } = useSurvey()

  switch (state.screen) {
    case 'focusAreas':
      return (
        <div className="grid max-w-5xl items-end gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <MultiSelectQuestion
            label={QUESTIONS[0].title}
            errorId="focus-areas-error"
            errorMessage={state.validationErrors.focusAreas}
            options={QUESTIONS[0].options}
            value={state.answers.focusAreas.selections}
            otherResponse={
              state.answers.focusAreas.selections.includes('other')
                ? {
                    maxLength: 300,
                    value: state.answers.focusAreas.other,
                    onChange: (other) =>
                      dispatch({
                        type: 'answer/changed',
                        questionId: 'focusAreas',
                        value: { ...state.answers.focusAreas, other },
                      }),
                  }
                : undefined
            }
            onChange={(selections) =>
              dispatch({
                type: 'answer/changed',
                questionId: 'focusAreas',
                value: {
                  selections,
                  other: selections.includes('other')
                    ? state.answers.focusAreas.other
                    : '',
                },
              })
            }
          />
          <PaperNote className="mb-3 hidden lg:block" title="你選擇了">
            {state.answers.focusAreas.selections.length > 0 ? (
              <ul className="grid gap-1.5">
                {state.answers.focusAreas.selections.map((selectedId) => (
                  <li key={selectedId} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-camp-forest" />
                    {QUESTIONS[0].options.find(({ id }) => id === selectedId)?.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p>選一選，看看最近哪些事最常來敲門。</p>
            )}
          </PaperNote>
        </div>
      )
    case 'recentMood':
      return (
        <MultiSelectQuestion
          label={QUESTIONS[1].title}
          errorId="recent-mood-error"
          errorMessage={state.validationErrors.recentMood}
          options={QUESTIONS[1].options}
          value={state.answers.recentMood.selections}
          otherResponse={
            state.answers.recentMood.selections.includes('other')
              ? {
                  maxLength: 300,
                  value: state.answers.recentMood.other,
                  onChange: (other) =>
                    dispatch({
                      type: 'answer/changed',
                      questionId: 'recentMood',
                      value: { ...state.answers.recentMood, other },
                    }),
                }
              : undefined
          }
          onChange={(selections) =>
            dispatch({
              type: 'answer/changed',
              questionId: 'recentMood',
              value: {
                selections,
                other: selections.includes('other')
                  ? state.answers.recentMood.other
                  : '',
              },
            })
          }
        />
      )
    case 'physicalEnergy':
      return (
        <ScaleQuestion
          label={QUESTIONS[2].title}
          errorId="physical-energy-error"
          errorMessage={state.validationErrors.physicalEnergy}
          min={QUESTIONS[2].min}
          max={QUESTIONS[2].max}
          lowLabel="較低"
          highLabel="充足"
          value={state.answers.physicalEnergy}
          variant="battery"
          onChange={(value) =>
            dispatch({ type: 'answer/changed', questionId: 'physicalEnergy', value })
          }
        />
      )
    case 'psychologicalEnergy':
      return (
        <div className="max-w-5xl">
          <ScaleQuestion
            label={QUESTIONS[3].title}
            errorId="psychological-energy-error"
            errorMessage={state.validationErrors.psychologicalEnergy}
            min={QUESTIONS[3].min}
            max={QUESTIONS[3].max}
            lowLabel="很累、提不起勁"
            highLabel="平穩、有力量"
            value={state.answers.psychologicalEnergy}
            onChange={(value) =>
              dispatch({
                type: 'answer/changed',
                questionId: 'psychologicalEnergy',
                value,
              })
            }
          />
          <PaperNote className="mt-8 max-w-64" title="小提醒">
            <p>沒有「標準答案」，這裡只是誠實地看看現在的你。</p>
          </PaperNote>
        </div>
      )
    case 'bodySignals':
      return (
        <BodyMapQuestion
          label={QUESTIONS[4].title}
          errorId="body-signals-error"
          errorMessage={state.validationErrors.bodySignals}
          options={QUESTIONS[4].options}
          value={state.answers.bodySignals}
          onChange={(value) =>
            dispatch({
              type: 'answer/changed',
              questionId: 'bodySignals',
              value,
            })
          }
        />
      )
    case 'campExpectation':
      return (
        <TextQuestion
          label="寫下來吧（選填）"
          errorId="camp-expectation-error"
          errorMessage={state.validationErrors.campExpectation}
          maxLength={QUESTIONS[5].maxLength}
          value={state.answers.campExpectation}
          placeholder="有想法就寫下來，也可以留白……"
          onChange={(value) =>
            dispatch({ type: 'answer/changed', questionId: 'campExpectation', value })
          }
        />
      )
    case 'profile':
    case 'complete':
      return null
  }
}
