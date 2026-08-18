interface FieldErrorProps {
  id: string
  message?: string
}

export function FieldError({ id, message }: FieldErrorProps) {
  const errorElement = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (message) errorElement.current?.focus({ preventScroll: false })
  }, [message])

  if (!message) return null

  return (
    <p
      id={id}
      ref={errorElement}
      tabIndex={-1}
      className="mt-4 max-w-2xl rounded-xl border border-red-900/12 bg-red-50/75 px-4 py-3 text-sm font-medium text-red-900"
      role="alert"
    >
      {message}
    </p>
  )
}
import { useEffect, useRef } from 'react'
