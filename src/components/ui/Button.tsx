import { ReactNode, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

export default function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95',
        variant === 'primary' && 'bg-brand-400 text-white hover:bg-brand-600',
        variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        variant === 'ghost' && 'text-gray-500 hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
