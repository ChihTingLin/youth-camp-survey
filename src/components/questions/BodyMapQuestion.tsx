import type { BodySignalId, BodySignalsAnswer } from '../../types/survey'
import { motion } from 'framer-motion'
import { BodySilhouette } from '../visuals/BodySilhouette'
import { OptionIcon } from './OptionIcon'
import { FieldError } from './FieldError'

interface BodyOption {
  id: BodySignalId
  label: string
}

interface BodyMapQuestionProps {
  label: string
  onChange: (value: BodySignalsAnswer) => void
  options: readonly BodyOption[]
  value: BodySignalsAnswer
  errorId?: string
  errorMessage?: string
}

const PILL_COLORS = [
  'bg-camp-sage/18',
  'bg-camp-sun/16',
  'bg-camp-mist/32',
  'bg-camp-peach/14',
] as const

export function BodyMapQuestion({
  label,
  onChange,
  options,
  value,
  errorId,
  errorMessage,
}: BodyMapQuestionProps) {
  const leftOptions = options.slice(0, 5)
  const rightOptions = options.slice(5)

  function toggle(optionId: BodySignalId) {
    const selections = value.selections.includes(optionId)
      ? value.selections.filter((selectedId) => selectedId !== optionId)
      : [...value.selections, optionId]
    onChange({ ...value, selections })
  }

  return (
    <fieldset
      className="question-block body-map-question relative mt-8 max-w-5xl sm:mt-10"
      aria-invalid={Boolean(errorMessage)}
      aria-describedby={errorMessage ? errorId : undefined}
    >
      <legend className="sr-only">{label}</legend>

      <div className="pointer-events-none absolute top-4 bottom-24 left-1/2 z-0 w-36 -translate-x-1/2 opacity-35 sm:w-44 lg:w-52 lg:opacity-100">
        <BodySilhouette />
      </div>

      <div className="body-options-grid relative z-10 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-[minmax(15rem,1fr)_14rem_minmax(15rem,1fr)] lg:gap-x-7 lg:gap-y-4">
        <div className="grid content-start gap-3 lg:col-start-1 lg:row-start-1 lg:gap-4">
          {leftOptions.map((option, index) => (
            <BodyOptionPill
              key={option.id}
              option={option}
              selected={value.selections.includes(option.id)}
              color={PILL_COLORS[index % PILL_COLORS.length]}
              side="left"
              onToggle={() => toggle(option.id)}
            />
          ))}
        </div>

        <div className="grid content-start gap-3 lg:col-start-3 lg:row-start-1 lg:gap-4 lg:pt-10">
          {rightOptions.map((option, index) => (
            <BodyOptionPill
              key={option.id}
              option={option}
              selected={value.selections.includes(option.id)}
              color={PILL_COLORS[(index + 2) % PILL_COLORS.length]}
              side="right"
              onToggle={() => toggle(option.id)}
            />
          ))}
        </div>

        <label className="body-other-panel col-span-2 mt-4 block rounded-[2rem] border border-camp-forest/12 bg-white/65 px-6 py-5 text-center shadow-sm backdrop-blur-md focus-within:border-camp-forest/45 sm:mt-6 lg:col-span-3 lg:mt-10 lg:justify-self-center lg:w-full lg:max-w-xl">
          <span className="flex items-center justify-center gap-2 text-sm font-medium tracking-[0.1em] text-camp-forest">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m5 19 3-1 10-10-2-2L6 16l-1 3Z" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            還有其他感覺嗎？
          </span>
          <input
            type="text"
            className="mx-auto mt-2 w-full max-w-sm border-0 border-b border-dashed border-camp-forest/35 bg-transparent px-0 py-2 text-center text-base text-camp-ink outline-none placeholder:text-camp-ink/35"
            value={value.other}
            maxLength={300}
            placeholder="點我輸入"
            onChange={(event) => onChange({ ...value, other: event.target.value })}
          />
        </label>
      </div>
      {errorId ? <FieldError id={errorId} message={errorMessage} /> : null}
    </fieldset>
  )
}

interface BodyOptionPillProps {
  color: string
  onToggle: () => void
  option: BodyOption
  selected: boolean
  side: 'left' | 'right'
}

function BodyOptionPill({
  color,
  onToggle,
  option,
  selected,
  side,
}: BodyOptionPillProps) {
  return (
    <motion.label
      className={`body-option tap-target group relative flex min-h-20 cursor-pointer items-center gap-2 border px-3 py-3 transition duration-200 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-camp-forest motion-reduce:transition-none sm:gap-4 sm:px-5 ${side === 'right' ? 'lg:flex-row-reverse lg:text-right' : ''} ${color} ${selected ? 'border-camp-forest bg-white/78 shadow-[0_9px_22px_rgba(49,65,60,0.12)]' : 'border-transparent hover:border-camp-forest/25 hover:bg-white/55'}`}
      style={{ borderRadius: side === 'left' ? '46% 36% 42% 35% / 44% 40% 46% 38%' : '36% 46% 35% 43% / 40% 45% 38% 48%' }}
      initial={false}
      animate={{ scale: selected ? 1.015 : 1 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={selected}
        onChange={onToggle}
      />
      <span className="shrink-0 scale-75 text-camp-forest sm:scale-90">
        <OptionIcon id={option.id} />
      </span>
      <span className="text-sm font-medium tracking-[0.04em] sm:text-base">
        {option.label}
      </span>
      <span
        className={`ml-auto grid size-5 shrink-0 place-items-center rounded border text-xs ${selected ? 'border-camp-forest bg-camp-forest text-white' : 'border-camp-forest/40 bg-white/65 text-transparent'} ${side === 'right' ? 'lg:order-first lg:ml-0 lg:mr-auto' : ''}`}
        aria-hidden="true"
      >
        ✓
      </span>
    </motion.label>
  )
}
