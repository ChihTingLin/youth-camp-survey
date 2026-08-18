import { motion } from 'framer-motion'

import { useSurvey } from '../../app/surveyContext'
import { StatisticsEntry } from '../statistics/PublicStatistics'

export function SubmissionStatus() {
  const { submission } = useSurvey()

  if (submission.status === 'submitting' || submission.status === 'idle') {
    return (
      <div
        className="mt-10 max-w-xl rounded-4xl border border-white/55 bg-white/48 p-6 shadow-[0_18px_45px_rgba(49,65,60,0.1)] backdrop-blur-sm sm:p-8"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-4">
          <motion.span
            className="block size-7 rounded-full border-3 border-camp-sage/40 border-t-camp-forest"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
          <p className="text-base leading-7 font-medium text-camp-ink">
            正在安全送出，請先不要關閉這個頁面…
          </p>
        </div>
      </div>
    )
  }

  if (submission.status === 'failed') {
    return (
      <div
        className="mt-10 max-w-xl rounded-4xl border border-red-900/15 bg-white/60 p-6 shadow-[0_18px_45px_rgba(49,65,60,0.1)] backdrop-blur-sm sm:p-8"
        role="alert"
      >
        <p className="text-base leading-7 text-camp-ink">{submission.error}</p>
        <p className="mt-2 text-sm leading-6 text-camp-ink/65">
          你可以直接重試，或回上一頁確認內容。
        </p>
        <button
          type="button"
          className="tap-target mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-camp-forest px-6 font-medium text-white shadow-[0_10px_24px_rgba(49,65,60,0.18)] transition hover:bg-camp-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-camp-forest motion-reduce:transition-none"
          onClick={submission.retry}
        >
          再試一次
        </button>
      </div>
    )
  }

  return (
    <div
      className="mt-10 max-w-xl rounded-4xl border border-white/60 bg-white/52 p-6 shadow-[0_18px_45px_rgba(49,65,60,0.1)] backdrop-blur-sm sm:p-8"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-full bg-camp-forest text-white"
          aria-hidden="true"
        >
          <svg className="size-6" viewBox="0 0 24 24" fill="none">
            <path
              d="m6.5 12.5 3.4 3.4 7.8-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="text-lg font-semibold text-camp-ink">答案已成功送達</p>
          <p className="mt-1 text-sm leading-6 text-camp-ink/65">
            這台裝置上的暫存答案已清除，謝謝你完成行前探索。
          </p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
        <StatisticsEntry />
        <button
          type="button"
          className="tap-target min-h-11 rounded-full px-2 text-sm font-medium text-camp-forest underline decoration-camp-sage underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-camp-forest"
          onClick={submission.startOver}
        >
          填寫另一份回覆
        </button>
      </div>
    </div>
  )
}
