import type { PropsWithChildren } from 'react'

interface PaperNoteProps extends PropsWithChildren {
  className?: string
  title: string
}

export function PaperNote({ children, className = '', title }: PaperNoteProps) {
  return (
    <aside
      className={`relative rotate-[-1deg] bg-[#fffdf7]/92 px-5 pt-7 pb-5 text-camp-ink/72 shadow-[0_14px_30px_rgba(72,91,79,0.12)] ${className}`}
    >
      <span
        className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-2 bg-camp-sage/45 [clip-path:polygon(4%_0,97%_5%,93%_34%,100%_59%,94%_100%,3%_93%,7%_66%,0_35%)]"
        aria-hidden="true"
      />
      <h2 className="border-b border-dashed border-camp-forest/30 pb-2 text-base font-medium tracking-[0.12em] text-camp-forest">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-7 tracking-[0.06em]">{children}</div>
    </aside>
  )
}
