import { useEffect, useRef } from 'react'

import { useSurvey } from '../../app/surveyContext'
import {
  GENDER_IDS,
  GROUP_VALUES,
  type GenderId,
} from '../../types/survey'
import { StatisticsEntry } from '../statistics/PublicStatistics'

const GENDER_LABELS: Record<GenderId, string> = {
  male: '男性',
  female: '女性',
  nonBinaryOrOther: '非二元／其他',
  preferNotToSay: '不願透露',
}

export function ProfileSetup() {
  const { state, dispatch } = useSurvey()
  const groupInput = useRef<HTMLSelectElement>(null)
  const genderInput = useRef<HTMLSelectElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.validationErrors.group) {
      groupInput.current?.focus()
    } else if (state.validationErrors.gender) {
      genderInput.current?.focus()
    } else if (state.validationErrors.name) {
      nameInput.current?.focus()
    }
  }, [
    state.validationErrors.gender,
    state.validationErrors.group,
    state.validationErrors.name,
  ])

  return (
    <div className="question-block profile-fields mt-8 grid max-w-2xl gap-4 sm:mt-10 sm:grid-cols-2">
      <label className="rounded-[1.75rem] border border-white/70 bg-white/65 px-5 py-4 shadow-[0_14px_35px_rgba(72,91,79,0.08)] backdrop-blur-md focus-within:border-camp-forest/45 sm:col-start-1 sm:row-start-1">
        <span className="text-sm font-semibold tracking-[0.08em] text-camp-forest">
          所屬組別 <span className="text-red-800" aria-hidden="true">＊</span>
        </span>
        <select
          ref={groupInput}
          required
          className="mt-2 w-full cursor-pointer border-0 border-b border-camp-forest/25 bg-transparent px-0 py-2 text-lg text-camp-ink outline-none"
          value={state.profile.group}
          aria-required="true"
          aria-invalid={Boolean(state.validationErrors.group)}
          aria-describedby={state.validationErrors.group ? 'group-error' : undefined}
          onChange={(event) =>
            dispatch({
              type: 'profile/changed',
              field: 'group',
              value: event.target.value as (typeof GROUP_VALUES)[number] | '',
            })
          }
        >
          <option value="" disabled>
            請選擇
          </option>
          {GROUP_VALUES.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        {state.validationErrors.group ? (
          <span id="group-error" className="mt-2 block text-sm text-red-800">
            {state.validationErrors.group}
          </span>
        ) : null}
      </label>

      <label className="rounded-[1.75rem] border border-white/70 bg-white/65 px-5 py-4 shadow-[0_14px_35px_rgba(72,91,79,0.08)] backdrop-blur-md focus-within:border-camp-forest/45 sm:col-start-1 sm:row-start-2">
        <span className="text-sm font-semibold tracking-[0.08em] text-camp-forest">
          性別 <span className="text-red-800" aria-hidden="true">＊</span>
        </span>
        <select
          ref={genderInput}
          required
          className="mt-2 w-full cursor-pointer border-0 border-b border-camp-forest/25 bg-transparent px-0 py-2 text-lg text-camp-ink outline-none"
          value={state.profile.gender ?? ''}
          aria-required="true"
          aria-invalid={Boolean(state.validationErrors.gender)}
          aria-describedby={state.validationErrors.gender ? 'gender-error' : undefined}
          onChange={(event) =>
            dispatch({
              type: 'profile/changed',
              field: 'gender',
              value: event.target.value
                ? (event.target.value as GenderId)
                : null,
            })
          }
        >
          <option value="" disabled>
            請選擇
          </option>
          {GENDER_IDS.map((gender) => (
            <option key={gender} value={gender}>
              {GENDER_LABELS[gender]}
            </option>
          ))}
        </select>
        {state.validationErrors.gender ? (
          <span id="gender-error" className="mt-2 block text-sm text-red-800">
            {state.validationErrors.gender}
          </span>
        ) : null}
      </label>

      <label className="rounded-[1.75rem] border border-white/70 bg-white/65 px-5 py-4 shadow-[0_14px_35px_rgba(72,91,79,0.08)] backdrop-blur-md focus-within:border-camp-forest/45 sm:col-start-2 sm:row-start-1">
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

      <StatisticsEntry className="justify-self-start sm:col-span-2 sm:row-start-3" />
    </div>
  )
}
