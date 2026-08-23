import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface ModeToggleOption<T extends string> {
  value: T
  label: string
  icon: ReactNode
}

interface ModeToggleProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: ModeToggleOption<T>[]
}

export function ModeToggle<T extends string>({ value, onChange, options }: ModeToggleProps<T>) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            value === opt.value
              ? 'bg-primary-500 text-[var(--on-accent)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
