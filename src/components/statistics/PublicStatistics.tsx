import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  fetchPublicStatistics,
  type AvailablePublicStatistics,
  type PublicCount,
  type PublicStatistics,
} from '../../app/surveyStatistics'
import { QUESTIONS } from '../../data/questions'

interface StatisticsEntryProps {
  className?: string
}

type LoadingState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'loaded'; data: PublicStatistics; error: null }
  | { status: 'failed'; data: null; error: string }

export function StatisticsEntry({ className = '' }: StatisticsEntryProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className={`tap-target min-h-11 rounded-full px-2 text-sm font-medium text-camp-forest underline decoration-camp-sage underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-camp-forest ${className}`}
        onClick={() => setOpen(true)}
      >
        查看大家的匿名統計
      </button>
      {open
        ? createPortal(
            <StatisticsDialog onClose={() => setOpen(false)} />,
            document.body,
          )
        : null}
    </>
  )
}

function StatisticsDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId()
  const [state, setState] = useState<LoadingState>({
    status: 'loading',
    data: null,
    error: null,
  })

  const requestStatistics = useCallback(async () => {
    try {
      setState({
        status: 'loaded',
        data: await fetchPublicStatistics(),
        error: null,
      })
    } catch (error) {
      setState({
        status: 'failed',
        data: null,
        error: error instanceof Error ? error.message : '讀取統計資料失敗。',
      })
    }
  }, [])

  const retry = useCallback(() => {
    setState({ status: 'loading', data: null, error: null })
    void requestStatistics()
  }, [requestStatistics])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    const requestTimer = window.setTimeout(() => {
      void requestStatistics()
    }, 0)

    return () => {
      window.clearTimeout(requestTimer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose, requestStatistics])

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-camp-ink/45 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="mx-auto min-h-full max-w-3xl rounded-[2rem] bg-camp-cream p-5 shadow-2xl sm:min-h-0 sm:p-8">
        <header className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-camp-forest">
              匿名回覆總覽
            </p>
            <h2 id={titleId} className="mt-2 text-2xl font-semibold text-camp-ink sm:text-3xl">
              看看大家此刻的位置
            </h2>
          </div>
          <button
            type="button"
            className="tap-target grid size-11 shrink-0 place-items-center rounded-full bg-white/70 text-2xl text-camp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-camp-forest"
            aria-label="關閉統計"
            autoFocus
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-camp-ink/65">
          只顯示整體選項次數與能量平均，不公開姓名、組別、時間或文字回答。累積至少
          5 份匿名回覆後才會顯示統計。
        </p>

        {state.status === 'loading' ? (
          <StatisticsState message="正在整理匿名統計…" />
        ) : state.status === 'failed' ? (
          <StatisticsState message={state.error} actionLabel="再試一次" onAction={retry} />
        ) : state.data.available ? (
          <StatisticsContent data={state.data} />
        ) : (
          <StatisticsState
            message={`目前有 ${state.data.totalResponses} 份回覆；累積到 ${state.data.minimumResponses} 份後就會顯示統計。`}
          />
        )}
      </div>
    </div>
  )
}

function StatisticsContent({ data }: { data: AvailablePublicStatistics }) {
  return (
    <div className="mt-7 grid gap-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Metric label="匿名回覆" value={String(data.totalResponses)} />
        <Metric label="身體能量" value={formatAverage(data.averagePhysicalEnergy)} />
        <Metric label="心理能量" value={formatAverage(data.averagePsychologicalEnergy)} />
      </div>

      <StatisticGroup
        title="最近最常放在心上的事"
        counts={data.focusAreas}
        options={QUESTIONS[0].options}
        total={data.totalResponses}
      />
      <StatisticGroup
        title="最近最常感受到的心情"
        counts={data.recentMoods}
        options={QUESTIONS[1].options}
        total={data.totalResponses}
      />
      <StatisticGroup
        title="大家觀察到的身體訊號"
        counts={data.bodySignals}
        options={QUESTIONS[4].options}
        total={data.totalResponses}
      />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-camp-forest/10 bg-white/65 p-3 text-center sm:p-4">
      <p className="text-xs text-camp-ink/55 sm:text-sm">{label}</p>
      <p className="mt-1 text-xl font-semibold text-camp-forest sm:text-2xl">{value}</p>
    </div>
  )
}

function StatisticGroup({
  counts,
  options,
  title,
  total,
}: {
  counts: Record<string, PublicCount>
  options: readonly { id: string; label: string }[]
  title: string
  total: number
}) {
  return (
    <section>
      <h3 className="text-base font-semibold text-camp-ink">{title}</h3>
      <div className="mt-3 grid gap-2.5">
        {options.map((option) => {
          const storedCount = counts[option.id]
          const count = storedCount === undefined ? 0 : storedCount
          const width = count === null ? 8 : (count / total) * 100
          return (
            <div key={option.id} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-2 text-sm sm:grid-cols-[8rem_1fr_3rem]">
              <span className="truncate">{option.label}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-camp-forest/10">
                <span
                  className="block h-full rounded-full bg-camp-forest/70"
                  style={{ width: `${Math.max(0, Math.min(100, width))}%` }}
                />
              </span>
              <strong className="text-right tabular-nums text-camp-forest">
                {count === null ? '< 3' : count}
              </strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function StatisticsState({
  actionLabel,
  message,
  onAction,
}: {
  actionLabel?: string
  message: string
  onAction?: () => void
}) {
  return (
    <div className="mt-10 rounded-3xl border border-camp-forest/10 bg-white/55 px-5 py-10 text-center">
      <p className="text-sm leading-6 text-camp-ink/70">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          className="tap-target mt-5 min-h-11 rounded-full bg-camp-forest px-5 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-camp-forest"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

function formatAverage(value: number | null): string {
  return value === null ? '—' : `${value} / 10`
}
