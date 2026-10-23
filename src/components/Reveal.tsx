import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>('0px 0px -10% 0px')
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`.trim()}
      style={{ ['--d' as string]: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
