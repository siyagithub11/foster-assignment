import type { ReactNode } from 'react'

export default function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-dvh bg-white sm:flex sm:justify-center">
      <div className={`relative flex min-h-dvh w-full max-w-107.5 flex-col bg-white sm:shadow-xl ${className}`}>
        {children}
      </div>
    </div>
  )
}