import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'

interface StreakWidgetProps {
  streak: number
}

export function StreakWidget({ streak }: StreakWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sequencia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-warning-500/15">
            <span className="text-2xl font-bold text-[var(--warning)]">{streak}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Dias de sequencia</p>
            <div className="flex gap-1 mt-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-4 h-4 rounded-full transition-all',
                    i < streak
                      ? 'bg-warning-500'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border)]'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
