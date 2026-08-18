import { useId, type CSSProperties } from 'react'
import { FieldError } from './FieldError'

interface ScaleQuestionProps {
  highLabel: string
  label: string
  lowLabel: string
  max: number
  min: number
  onChange: (value: number) => void
  value: number
  variant?: 'battery' | 'line'
  errorId?: string
  errorMessage?: string
}

type RangeStyle = CSSProperties & { '--range-progress': string }

export function ScaleQuestion({
  highLabel,
  label,
  lowLabel,
  max,
  min,
  onChange,
  value,
  variant = 'line',
  errorId,
  errorMessage,
}: ScaleQuestionProps) {
  const inputId = useId()
  const progress = ((value - min) / (max - min)) * 100

  if (variant === 'battery') {
    return (
      <fieldset
        className="question-block scale-question mt-8 max-w-4xl sm:mt-10"
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
      >
        <legend className="sr-only">{label}</legend>
        <div className="scale-card relative rounded-[42%_36%_40%_35%/12%_16%_14%_13%] border border-white/60 bg-white/56 px-5 py-9 shadow-[0_18px_50px_rgba(72,91,79,0.08)] backdrop-blur-md sm:px-10 sm:py-12">
          <div className="relative mx-auto max-w-3xl">
            <output
              className="battery-output absolute -top-18 z-20 grid size-16 -translate-x-1/2 place-items-center rounded-[48%_45%_45%_38%/48%_46%_52%_40%] bg-camp-forest text-3xl font-semibold text-white shadow-lg after:absolute after:-bottom-3 after:left-1/2 after:size-5 after:-translate-x-1/2 after:rotate-45 after:bg-camp-forest sm:-top-22 sm:size-20 sm:text-4xl"
              style={{ left: `${progress}%` }}
              htmlFor={inputId}
              aria-live="polite"
            >
              <span className="relative z-10">{value}</span>
            </output>

            <div className="relative rounded-[1.25rem] border-[5px] border-camp-sage bg-white/60 p-2 after:absolute after:top-1/2 after:-right-5 after:h-10 after:w-4 after:-translate-y-1/2 after:rounded-r-lg after:bg-camp-sage sm:p-3">
              <div className="battery-levels grid h-18 grid-cols-10 gap-1.5 sm:h-24 sm:gap-2">
                {Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className="rounded-md"
                    style={{
                      background: `color-mix(in srgb, ${index < 3 ? '#e9a080' : index < 6 ? '#efbd67' : '#7e9a78'} ${index + 62}%, white)`,
                    }}
                  />
                ))}
              </div>
              <span
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-camp-forest shadow-md sm:size-5"
                style={{ left: `${progress}%` }}
                aria-hidden="true"
              />
              <input
                id={inputId}
                type="range"
                className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-camp-forest"
                min={min}
                max={max}
                step={1}
                value={value}
                aria-label={label}
                onChange={(event) => onChange(event.target.valueAsNumber)}
              />
            </div>

            <div className="mt-5 grid grid-cols-10 gap-1" aria-hidden="true">
              {Array.from({ length: max - min + 1 }, (_, index) => index + min).map(
                (number) => (
                  <span
                    key={number}
                    className={`text-center text-xs sm:text-sm ${number === value ? 'font-semibold text-white' : 'text-camp-ink/55'}`}
                  >
                    <span className={number === value ? 'inline-grid size-7 place-items-center rounded-full bg-camp-forest' : ''}>
                      {number}
                    </span>
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="scale-caption mt-7 flex items-center justify-between gap-5 text-sm tracking-[0.08em]">
            <div className="flex items-center gap-2 text-camp-peach">
              <span className="text-2xl">☁</span>
              <span className="rounded-full bg-camp-peach/25 px-4 py-1.5 text-camp-ink/70">{lowLabel}</span>
            </div>
            <p className="hidden text-center text-camp-forest/75 sm:block">選擇最符合你最近身體狀態的分數</p>
            <div className="flex items-center gap-2 text-camp-forest">
              <span className="rounded-full bg-camp-sage/35 px-4 py-1.5 text-camp-ink/75">{highLabel}</span>
              <span className="text-2xl">☀</span>
            </div>
          </div>
        </div>
        {errorId ? <FieldError id={errorId} message={errorMessage} /> : null}
      </fieldset>
    )
  }

  return (
    <fieldset
      className="question-block scale-question mt-8 max-w-4xl sm:mt-10"
      aria-invalid={Boolean(errorMessage)}
      aria-describedby={errorMessage ? errorId : undefined}
    >
      <legend className="sr-only">{label}</legend>
      <div className="scale-card rounded-[2rem] border border-white/60 bg-white/66 px-5 py-7 shadow-[0_18px_50px_rgba(72,91,79,0.10)] backdrop-blur-md sm:px-9 sm:py-9">
        <div className="flex items-end justify-between gap-4 text-sm text-camp-ink/65 sm:text-base">
          <div>
            <span className="block font-semibold text-camp-forest">低</span>
            <span>{lowLabel}</span>
          </div>
          <output
            className="scale-output grid size-18 place-items-center rounded-[42%_48%_45%_40%/44%_42%_50%_40%] bg-camp-forest text-3xl font-semibold text-white shadow-lg sm:size-22 sm:text-4xl"
            htmlFor={inputId}
            aria-live="polite"
          >
            {value}
          </output>
          <div className="text-right">
            <span className="block font-semibold text-camp-forest">高</span>
            <span>{highLabel}</span>
          </div>
        </div>

        <input
          id={inputId}
          type="range"
          className="camp-range mt-8 w-full"
          min={min}
          max={max}
          step={1}
          value={value}
          aria-label={label}
          style={{ '--range-progress': `${progress}%` } as RangeStyle}
          onChange={(event) => onChange(event.target.valueAsNumber)}
        />

        <div className="mt-4 grid grid-cols-10 gap-1" aria-hidden="true">
          {Array.from({ length: max - min + 1 }, (_, index) => index + min).map(
            (number) => (
              <span
                key={number}
                className={`text-center text-xs sm:text-sm ${number === value ? 'font-semibold text-camp-forest' : 'text-camp-ink/45'}`}
              >
                {number}
              </span>
            ),
          )}
        </div>
      </div>
      {errorId ? <FieldError id={errorId} message={errorMessage} /> : null}
    </fieldset>
  )
}
