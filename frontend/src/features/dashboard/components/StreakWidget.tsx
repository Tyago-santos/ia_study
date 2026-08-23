import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'

interface StreakWidgetProps {
  streak: number
}

export function StreakWidget({ streak }: StreakWidgetProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5" />
      <CardHeader className="relative">
        <CardTitle>Sequencia</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
            <span className="text-2xl font-bold text-[var(--on-accent)]">{streak}</span>
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
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-amber-500/30'
                      : 'bg-[var(--bg-secondary)]'
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
