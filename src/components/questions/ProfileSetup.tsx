import { useEffect, useRef } from 'react'

import { useSurvey } from '../../app/surveyContext'
import { StatisticsEntry } from '../statistics/PublicStatistics'

export function ProfileSetup() {
  const { state, dispatch } = useSurvey()
  const groupInput = useRef<HTMLInputElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.validationErrors.group) {
      groupInput.current?.focus()
    } else if (state.validationErrors.name) {
      nameInput.current?.focus()
    }
  }, [state.validationErrors.group, state.validationErrors.name])

  return (
    <div className="question-block profile-fields mt-8 grid max-w-2xl gap-4 sm:mt-10 sm:grid-cols-2">
      <label className="rounded-[1.75rem] border border-white/70 bg-white/65 px-5 py-4 shadow-[0_14px_35px_rgba(72,91,79,0.08)] backdrop-blur-md focus-within:border-camp-forest/45">
        <span className="text-sm font-semibold tracking-[0.08em] text-camp-forest">
          所屬組別 <span className="font-normal text-camp-ink/45">（選填）</span>
        </span>
        <input
          ref={groupInput}
          type="text"
          className="mt-2 w-full border-0 border-b border-camp-forest/25 bg-transparent px-0 py-2 text-lg text-camp-ink outline-none placeholder:text-camp-ink/30"
          value={state.profile.group}
          maxLength={80}
          aria-invalid={Boolean(state.validationErrors.group)}
          aria-describedby={state.validationErrors.group ? 'group-error' : undefined}
          placeholder="例如：第一小隊，也可以留白"
          autoComplete="organization"
          onChange={(event) =>
            dispatch({
              type: 'profile/changed',
              field: 'group',
              value: event.target.value,
            })
          }
        />
        {state.validationErrors.group ? (
          <span id="group-error" className="mt-2 block text-sm text-red-800">
            {state.validationErrors.group}
          </span>
        ) : null}
      </label>

      <label className="rounded-[1.75rem] border border-white/70 bg-white/65 px-5 py-4 shadow-[0_14px_35px_rgba(72,91,79,0.08)] backdrop-blur-md focus-within:border-camp-forest/45">
        <span className="text-sm font-semibold tracking-[0.08em] text-camp-forest">
          姓名 <span className="font-normal text-camp-ink/45">（選填）</span>
        </span>
        <input
          ref={nameInput}
          type="text"
          className="mt-2 w-full border-0 border-b border-camp-forest/25 bg-transparent px-0 py-2 text-lg text-camp-ink outline-none placeholder:text-camp-ink/30"
          value={state.profile.name}
          maxLength={80}
          aria-invalid={Boolean(state.validationErrors.name)}
          aria-describedby={state.validationErrors.name ? 'name-error' : undefined}
          placeholder="可以留白"
          autoComplete="name"
          onChange={(event) =>
            dispatch({
              type: 'profile/changed',
              field: 'name',
              value: event.target.value,
            })
          }
        />
        {state.validationErrors.name ? (
          <span id="name-error" className="mt-2 block text-sm text-red-800">
            {state.validationErrors.name}
          </span>
        ) : null}
      </label>

      <StatisticsEntry className="justify-self-start sm:col-span-2" />
    </div>
  )
}
