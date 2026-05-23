import { ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={clsx('bg-white rounded-2xl border border-gray-100 p-4', className)} {...props}>
      {children}
    </div>
  )
}
