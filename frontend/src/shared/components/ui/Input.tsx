import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[var(--text)] mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-10 px-3 rounded-lg border bg-[var(--card-bg)] text-[var(--text)]',
            'placeholder:text-[var(--text-secondary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent',
            error ? 'border-error-500' : 'border-[var(--border)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
