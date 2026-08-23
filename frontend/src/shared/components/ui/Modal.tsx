import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 2147483647 }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(
          'relative w-full max-w-sm rounded-2xl border backdrop-blur-xl p-6',
          'bg-[var(--card-bg)] border-[var(--glass-border)] shadow-2xl',
          'animate-fade-in',
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
