import type { ReactNode } from 'react'
import { FileX } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-[var(--text-secondary)]">
        {icon || <FileX className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-medium text-[var(--text)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  )
}

export { EmptyState }
