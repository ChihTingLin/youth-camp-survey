import { motion } from 'framer-motion'

interface ProgressHeaderProps {
  current: number
  total: number
  phase: 'profile' | 'question' | 'complete'
}

export function ProgressHeader({
  current,
  total,
  phase,
}: ProgressHeaderProps) {
  const percentage =
    phase === 'profile' ? 0 : phase === 'complete' ? 100 : (current / total) * 100
  const counter =
    phase === 'profile'
      ? '準備出發'
      : phase === 'complete'
        ? '旅程完成'
        : `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <header className="progress-header flex items-start justify-between gap-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:gap-6 sm:pt-8 lg:pt-10">
      <div className="min-w-0 flex-1 sm:max-w-md">
        <div className="flex items-baseline gap-1 text-camp-forest">
          <span className="text-lg font-semibold tracking-[0.08em] sm:text-xl">
            {counter}
          </span>
        </div>
        <div
          className="progress-track mt-3 h-1 overflow-hidden rounded-full bg-camp-forest/15"
          role="progressbar"
          aria-label="問卷進度"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={phase === 'profile' ? 0 : current}
          aria-valuetext={counter}
        >
          <motion.div
            className="h-full rounded-full bg-camp-forest"
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-0.5 text-camp-forest">
        <span className="hidden text-sm font-medium tracking-[0.18em] sm:inline">
          心事・有人知
        </span>
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M19.5 3.5C12.8 4.1 7.8 7.2 6.4 12.1c-.8 2.7.1 5 1.6 6.4 1.7-5.2 4.8-8.4 8.7-10.4-3.3 2.6-5.7 6-7.1 10.3 2.2.4 4.8-.5 6.6-2.7 2.9-3.4 3.3-8.4 3.3-12.2Z"
            fill="currentColor"
          />
          <path
            d="M8.1 17.8c-1.3 1.1-2.3 2.3-3 3.7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </header>
  )
}
