import { useId } from 'react'
import { motion } from 'framer-motion'

interface LandscapeProps {
  progress: number
  variant: 'body' | 'energy' | 'lake' | 'trail' | 'writing'
}

export function Landscape({ progress, variant }: LandscapeProps) {
  const id = useId().replaceAll(':', '')
  const markerX = 178 + Math.min(1, Math.max(0, progress)) * 690

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${variant === 'writing' ? 'h-[clamp(30rem,65vw,49rem)]' : variant === 'body' ? 'h-[clamp(24rem,54vw,40rem)] opacity-75' : 'h-[clamp(20rem,48vw,36rem)]'}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-x-0 bottom-0 h-full min-w-[52rem] -translate-x-1/2 left-1/2 sm:min-w-[68rem] lg:min-w-full"
        viewBox="0 0 1200 560"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <defs>
          <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#F6C978" stopOpacity=".72" />
            <stop offset="1" stopColor="#F6C978" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-far`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#CAD4BD" />
            <stop offset="1" stopColor="#9EB7AD" />
          </linearGradient>
          <linearGradient id={`${id}-mid`} x1="0" y1="0" x2="1" y2=".2">
            <stop stopColor="#6F9C96" />
            <stop offset="1" stopColor="#8DA996" />
          </linearGradient>
          <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#557F79" />
            <stop offset=".6" stopColor="#8AA078" />
            <stop offset="1" stopColor="#A8B484" />
          </linearGradient>
          <linearGradient id={`${id}-road`} x1=".5" y1="0" x2=".5" y2="1">
            <stop stopColor="#FFF9ED" stopOpacity=".82" />
            <stop offset="1" stopColor="#FFF4DF" />
          </linearGradient>
          <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <circle cx="740" cy="112" r="70" fill={`url(#${id}-sun)`} filter={`url(#${id}-blur)`} />
        <circle cx="740" cy="112" r="31" fill="#FFF8E9" />

        {variant === 'writing' ? (
          <g stroke="#6F9188" strokeWidth="2" strokeLinecap="round" opacity=".75">
            <path d="M920 126c8-7 16-7 24 0 8-7 16-7 24 0" />
            <path d="M982 162c6-5 12-5 18 0 6-5 12-5 18 0" />
          </g>
        ) : null}

        <g className="motion-safe:animate-[camp-cloud-drift_12s_ease-in-out_infinite]" fill="#fff" fillOpacity=".58">
          <path d="M235 155c9-21 35-25 50-8 16-16 43-7 45 15h-99c0-2 2-5 4-7Z" />
          <path d="M846 86c8-17 29-21 42-7 13-13 35-6 37 12h-82c0-2 1-3 3-5Z" />
        </g>

        <path
          d="M0 298c104-58 181-42 261 3 79 45 140 39 223-15 93-60 172-87 274-26 91 54 178 44 262-7 63-38 118-39 180-4v311H0V298Z"
          fill={`url(#${id}-far)`}
        />

        {variant === 'lake' ? (
          <>
            <path d="M0 385c210-45 375-25 533 15 154 39 319 42 667-11v171H0V385Z" fill="#AFC9C6" fillOpacity=".72" />
            <path d="M0 440c231-42 404-22 565 17 179 43 345 36 635-21v124H0V440Z" fill="#C6D8D2" fillOpacity=".72" />
            <g fill="#3F6860" fillOpacity=".8">
              <path d="m1045 330 18-58 18 58h-13v53h-10v-53h-13Z" />
              <path d="m1090 350 15-48 15 48h-11v44h-8v-44h-11Z" />
            </g>
          </>
        ) : null}
        <path
          d="M0 342c98-56 176-60 263-9 78 46 159 47 248 3 107-53 194-59 284-5 108 65 209 67 405-9v238H0V342Z"
          fill={`url(#${id}-mid)`}
        />
        <path
          d="M0 414c131-69 252-76 372-16 96 48 190 48 286 5 119-53 211-43 302 5 78 41 151 44 240 15v137H0V414Z"
          fill={`url(#${id}-front)`}
        />

        <path
          d="M734 254c-88 25-119 46-76 61 57 19 3 39-53 53-72 18-79 39 5 55 110 21 79 54-33 78-76 16-121 35-139 59h278c-5-24 24-49 75-76 71-38 55-65-53-83-73-12-80-30-19-52 86-31 91-55 15-66-43-6-43-16 0-29Z"
          fill={`url(#${id}-road)`}
        />

        <motion.g
          initial={false}
          animate={{ x: markerX }}
          transition={{ type: 'spring', stiffness: 90, damping: 22 }}
        >
          <circle cx="0" cy="391" r="12" fill="#F7F1E7" fillOpacity=".9" />
          <circle cx="0" cy="391" r="5" fill="#506F5E" />
        </motion.g>

        <g fill="#315C52" fillOpacity=".78">
          <path d="M48 560v-91c-31 3-43 28-23 50-23 5-29 25-13 41h36Z" />
          <path d="M78 560v-113c32 8 39 37 16 55 25 9 28 35 6 58H78Z" />
          <path d="M1148 560v-104c-28 8-36 35-15 53-24 10-26 34-5 51h20Z" />
          <path d="M1175 560v-130c31 12 34 44 10 61 23 14 21 44-10 69Z" />
        </g>
      </svg>
    </div>
  )
}
