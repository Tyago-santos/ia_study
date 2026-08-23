import type { ReactNode } from 'react'
import { AlertTriangle, WifiOff } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  action?: ReactNode
}

function ErrorState({ title = 'Algo deu errado', message, onRetry, action }: ErrorStateProps) {
  const isOffline = message.includes('indisponivel') || message.includes('offline')

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 p-4 rounded-2xl bg-error-500/10">
        {isOffline ? (
          <WifiOff className="w-10 h-10 text-[var(--danger)]" />
        ) : (
          <AlertTriangle className="w-10 h-10 text-[var(--danger)]" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
        {isOffline ? 'Servidor indisponivel' : title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
      {action}
    </div>
  )
}

export { ErrorState }
