import { motion } from 'framer-motion'

interface NavigationControlsProps {
  nextLabel: string
  onBack: () => void
  onNext: () => void
  showBack: boolean
  showNext: boolean
}

export function NavigationControls({
  nextLabel,
  onBack,
  onNext,
  showBack,
  showNext,
}: NavigationControlsProps) {
  return (
    <div className="navigation-controls flex min-h-24 items-end justify-between gap-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:min-h-28 sm:pb-8">
      <div className="min-w-0 flex-1">
        {showBack ? (
          <motion.button
            type="button"
            className="tap-target group inline-flex min-h-11 items-center gap-2 rounded-full px-1 pr-4 text-sm font-medium text-camp-ink/75 transition-colors hover:text-camp-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-camp-forest"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
          >
            <svg
              className="size-5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m14.5 6-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            回上一頁
          </motion.button>
        ) : null}
      </div>

      {showNext ? (
        <motion.button
          type="button"
          className="next-button tap-target group flex min-h-20 shrink-0 flex-col items-center gap-2 rounded-3xl text-sm font-medium text-camp-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-camp-forest sm:min-h-24"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
        >
          <span className="next-button-icon grid size-16 place-items-center rounded-full bg-camp-forest text-white shadow-[0_12px_30px_rgba(49,65,60,0.18)] transition duration-200 group-hover:-translate-y-1 group-hover:bg-camp-ink group-active:translate-y-0 motion-reduce:transition-none sm:size-18">
            <svg
              className="size-8"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 16h19m-7-7 7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {nextLabel}
        </motion.button>
      ) : null}
    </div>
  )
}
