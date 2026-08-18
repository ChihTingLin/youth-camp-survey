import { OptionIcon } from './OptionIcon'
import { FieldError } from './FieldError'

interface ChoiceOption<Id extends string> {
  id: Id
  label: string
}

interface OtherResponse {
  maxLength: number
  onChange: (value: string) => void
  value: string
}

interface SingleSelectQuestionProps<Id extends string> {
  label: string
  name: string
  onChange: (value: Id) => void
  options: readonly ChoiceOption<Id>[]
  otherResponse?: OtherResponse
  value: Id | null
  layout?: 'default' | 'mood'
  errorId?: string
  errorMessage?: string
}

const CARD_COLORS = [
  'bg-camp-peach/16',
  'bg-camp-sun/18',
  'bg-camp-mist/35',
  'bg-camp-sage/20',
] as const

export function SingleSelectQuestion<Id extends string>({
  label,
  name,
  onChange,
  options,
  otherResponse,
  value,
  layout = 'default',
  errorId,
  errorMessage,
}: SingleSelectQuestionProps<Id>) {
  return (
    <fieldset
      className="question-block mt-8 sm:mt-10"
      aria-invalid={Boolean(errorMessage)}
      aria-describedby={errorMessage ? errorId : undefined}
    >
      <legend className="sr-only">{label}</legend>
      <div className={`choice-grid grid grid-cols-2 gap-3 sm:gap-4 ${layout === 'mood' ? 'sm:grid-cols-5' : 'sm:grid-cols-3 lg:grid-cols-5'}`}>
        {options.map((option, index) => {
          const selected = value === option.id
          return (
            <motion.label
              key={option.id}
              className={`choice-card tap-target group relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 border px-3 py-5 text-center transition duration-200 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-camp-forest motion-reduce:transition-none sm:min-h-36 ${layout === 'mood' && index === options.length - 1 ? 'col-span-2 mx-auto w-1/2 sm:col-span-1 sm:col-start-3 sm:w-full' : ''} ${CARD_COLORS[index % CARD_COLORS.length]} ${selected ? 'border-camp-forest bg-white/70 text-camp-ink shadow-[0_10px_24px_rgba(49,65,60,0.12)]' : 'border-transparent text-camp-ink/80 hover:border-camp-forest/25 hover:bg-white/45'}`}
              style={{ borderRadius: `${38 + (index % 2) * 8}% ${44 - (index % 3) * 4}% 42% 36% / 44% 38% 47% 39%` }}
              initial={false}
              animate={{ y: selected ? -2 : 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
              />
              <span className="choice-icon text-camp-forest transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none">
                <OptionIcon id={option.id} />
              </span>
              <span className="font-medium tracking-[0.08em]">{option.label}</span>
              <span
                className={`absolute top-3 right-3 size-4 rounded-full border-[3px] transition ${selected ? 'border-camp-forest bg-white' : 'border-camp-forest/20 bg-white/40'}`}
                aria-hidden="true"
              />
            </motion.label>
          )
        })}
      </div>
      {otherResponse ? (
        <motion.label
          className="other-input-panel mt-5 block max-w-2xl rounded-[1.75rem] border border-camp-forest/15 bg-white/55 px-5 py-4 shadow-sm backdrop-blur-sm focus-within:border-camp-forest/45"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-sm font-medium tracking-[0.08em] text-camp-forest">
            想到的是哪一種感受？
          </span>
          <input
            type="text"
            className="mt-2 w-full border-0 border-b border-dashed border-camp-forest/35 bg-transparent px-0 py-2 text-base text-camp-ink outline-none placeholder:text-camp-ink/35"
            value={otherResponse.value}
            maxLength={otherResponse.maxLength}
            placeholder="請寫下你的感受"
            autoFocus
            required
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorId : undefined}
            onChange={(event) => otherResponse.onChange(event.target.value)}
          />
        </motion.label>
      ) : null}
      {errorId ? <FieldError id={errorId} message={errorMessage} /> : null}
    </fieldset>
  )
}
import { motion } from 'framer-motion'
