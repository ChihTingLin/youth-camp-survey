import type { ReactNode } from 'react'

interface OptionIconProps {
  id: string
}

export function OptionIcon({ id }: OptionIconProps) {
  return (
    <svg
      className="size-10"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {getIcon(id)}
    </svg>
  )
}

function getIcon(id: string): ReactNode {
  switch (id) {
    case 'work':
      return <><rect x="8" y="16" width="32" height="23" rx="4" /><path d="M18 16v-4h12v4M8 25h32M21 24v4h6v-4" /></>
    case 'finances':
      return <><path d="M9 15h26a4 4 0 0 1 4 4v19H13a5 5 0 0 1-5-5V14a4 4 0 0 1 4-4h22" /><path d="M30 24h10v9H30a4.5 4.5 0 0 1 0-9Z" /><circle cx="31" cy="28.5" r="1" /></>
    case 'family':
      return <><circle cx="24" cy="15" r="6" /><circle cx="11" cy="22" r="4" /><circle cx="37" cy="22" r="4" /><path d="M14 40v-7a10 10 0 0 1 20 0v7M4 40v-7a7 7 0 0 1 9-6.7M44 40v-7a7 7 0 0 0-9-6.7" /></>
    case 'relationships':
      return <path d="M24 39S8 30 8 18a8 8 0 0 1 15-4 8 8 0 0 1 17 4c0 12-16 21-16 21Z" />
    case 'health':
      return <><path d="M5 25h9l4-11 7 23 5-17 4 5h9" /><path d="M24 42C11 34 6 27 7 17a9 9 0 0 1 17-4 9 9 0 0 1 17 4c1 10-4 17-17 25Z" opacity=".35" /></>
    case 'futureDirection':
      return <><circle cx="24" cy="24" r="18" /><path d="m30 17-4 10-9 4 4-10 9-4Z" /><circle cx="24" cy="24" r="1.5" /></>
    case 'selfGrowth':
    case 'relaxed':
      return <><path d="M24 41V22" /><path d="M24 26C12 25 8 18 8 9c10 0 17 4 18 13M24 30c12-1 17-8 16-18-9 0-15 5-16 14" /></>
    case 'busy':
      return <><circle cx="23" cy="24" r="17" /><path d="M23 14v11l8 5M35 8l4 4" /></>
    case 'empty':
      return <path strokeDasharray="4 4" d="M10 34h26a7 7 0 0 0 1-14 12 12 0 0 0-22-4 9 9 0 0 0-5 18Z" />
    case 'pressured':
      return <><path d="M13 37h22l-3-20H16l-3 20ZM20 17a4 4 0 1 1 8 0" /><path d="M9 10h30" opacity=".4" /></>
    case 'drained':
    case 'fatigue':
      return <><rect x="9" y="14" width="27" height="21" rx="3" /><path d="M36 21h4v8h-4M14 19v11" /></>
    case 'lost':
      return <><path d="M8 36c9-15 22-7 27-23M31 13h4v4" /><path d="M8 40h32" opacity=".35" /></>
    case 'stable':
      return <><path d="m5 36 11-14 8 8 8-13 11 19" /><path d="M5 40h38" /></>
    case 'fulfilled':
      return <><circle cx="24" cy="24" r="8" /><path d="M24 7v5M24 36v5M7 24h5M36 24h5M12 12l4 4M32 32l4 4M36 12l-4 4M16 32l-4 4" /></>
    case 'hopeful':
      return <><path d="m24 7 3.5 11.5L39 22l-11.5 3.5L24 39l-3.5-13.5L9 22l11.5-3.5L24 7Z" /><path d="m39 8 1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4Z" /></>
    case 'shoulderTension':
      return <><circle cx="24" cy="13" r="6" /><path d="M8 39c1-10 6-15 16-15s15 5 16 15M13 26l5 6M35 26l-5 6" /></>
    case 'chestTightness':
      return <><path d="M22 13v25c-8 1-14-3-14-11 0-7 4-13 10-17M26 13v25c8 1 14-3 14-11 0-7-4-13-10-17" /><path d="M16 24c4 0 6 2 6 5M32 24c-4 0-6 2-6 5" /></>
    case 'stomachDiscomfort':
      return <path d="M20 7v10c0 4-8 6-8 15 0 7 5 10 12 10 11 0 16-7 14-16-2-7-8-8-12-5V7" />
    case 'headache':
      return <><path d="M30 39H17v-7c-5-3-7-8-6-13 1-8 8-13 16-12 8 1 13 8 12 16" /><path d="m37 11 5-3M39 17h5M37 23l5 3" /></>
    case 'poorSleep':
      return <><path d="M35 31A16 16 0 0 1 17 9a16 16 0 1 0 18 22Z" /><path d="M31 8h7l-7 7h7M10 9h5l-5 5h5" /></>
    case 'anxious':
    case 'mentalTension':
      return <><path d="M10 15c5-8 10 8 15 0s10 8 14 0M8 24c6-8 11 8 17 0s10 8 15 0M11 33c5-8 9 8 14 0s9 7 13 0" /><circle cx="24" cy="24" r="18" opacity=".25" /></>
    case 'noSpecialFeeling':
      return <><circle cx="24" cy="24" r="18" /><path d="M17 20h.1M31 20h.1M17 31h14" /></>
    case 'other':
    default:
      return <><circle cx="13" cy="24" r="2" fill="currentColor" stroke="none" /><circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" /><circle cx="35" cy="24" r="2" fill="currentColor" stroke="none" /></>
  }
}
