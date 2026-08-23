import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary-500 text-[var(--on-accent)] hover:bg-primary-600 active:bg-primary-700': variant === 'primary',
            'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--border)] active:bg-[var(--border)]': variant === 'secondary',
            'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] active:bg-[var(--bg-secondary)]': variant === 'ghost',
            'bg-[var(--danger-solid)] text-white hover:bg-red-700 active:bg-red-800': variant === 'danger',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
