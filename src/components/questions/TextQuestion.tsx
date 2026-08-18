import { FieldError } from './FieldError'

interface TextQuestionProps {
  label: string
  maxLength: number
  onChange: (value: string) => void
  placeholder: string
  value: string
  errorId?: string
  errorMessage?: string
}

export function TextQuestion({
  label,
  maxLength,
  onChange,
  placeholder,
  value,
  errorId,
  errorMessage,
}: TextQuestionProps) {
  return (
    <div className="question-block text-question mt-8 max-w-4xl sm:mt-10">
      <label className="block rounded-[2rem] border border-white/70 bg-white/68 p-5 shadow-[0_18px_50px_rgba(72,91,79,0.10)] backdrop-blur-md focus-within:border-camp-forest/40 sm:p-8">
        <span className="flex items-center gap-3 font-medium tracking-[0.08em] text-camp-forest">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 19 3.5-1 9.8-9.8-2.5-2.5L6 15.5 5 19Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="m14.8 6.7 2.5 2.5M5 21h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          {label}
        </span>
        <textarea
          className="expectation-input mt-5 min-h-52 w-full resize-y rounded-2xl border border-dashed border-camp-forest/30 bg-camp-cream/30 p-4 leading-7 text-camp-ink outline-none transition placeholder:text-camp-ink/35 focus:border-camp-forest/60 focus:bg-white/50 motion-reduce:transition-none sm:min-h-64 sm:p-5"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="mt-2 block text-right text-xs tabular-nums text-camp-ink/45">
          {value.length} / {maxLength}
        </span>
      </label>
      {errorId ? <FieldError id={errorId} message={errorMessage} /> : null}
    </div>
  )
}
