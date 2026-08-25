import { Clock, FileText, Layers, Sparkles, Timer, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { cn, formatRelativeTime } from '@/shared/lib/utils'
import type { Activity } from '@/shared/types'

const typeConfig: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  pomodoro: { icon: Timer, color: 'text-[var(--accent-text)]', bg: 'bg-primary-500/15', label: 'Foco' },
  quiz: { icon: Trophy, color: 'text-[var(--accent-text)]', bg: 'bg-emerald-500/15', label: 'Quiz' },
  flashcard: { icon: Layers, color: 'text-[var(--warning)]', bg: 'bg-amber-500/15', label: 'Flashcard' },
  summary: { icon: FileText, color: 'text-primary-400', bg: 'bg-primary-400/15', label: 'Resumo' },
}

function getDayGroup(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((today.getTime() - target.getTime()) / 86400000)

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return 'Esta semana'
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const grouped = activities.reduce<Record<string, Activity[]>>((acc, act) => {
    const group = getDayGroup(act.createdAt)
    if (!acc[group]) acc[group] = []
    acc[group].push(act)
    return acc
  }, {})

  const groupOrder = ['Hoje', 'Ontem', 'Esta semana']
  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const ai = groupOrder.indexOf(a)
    const bi = groupOrder.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent-text)]" />
          <CardTitle>Atividades recentes</CardTitle>
        </div>
        <span className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2.5 py-1 rounded-full border border-[var(--glass-border)]">
          {activities.length} atividades
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedGroups.map(([group, items], groupIdx) => (
            <div
              key={group}
              className="animate-fade-in"
              style={{ animationDelay: `${groupIdx * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-0.5 rounded-full bg-primary-500/50" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {group}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
              </div>

              <div className="relative pl-4">
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-primary-500/30 via-primary-400/20 to-transparent" />

                <div className="space-y-2">
                  {items.map((activity, i) => {
                    const config = typeConfig[activity.type] ?? typeConfig.pomodoro
                    const Icon = config.icon
                    return (
                      <div
                        key={activity.id}
                        className={cn(
                          'relative flex items-start gap-3 p-3 rounded-xl transition-all duration-200',
                          'hover:bg-[var(--glass-bg)] hover:border-[var(--glass-border)]',
                          'border border-transparent group'
                        )}
                        style={{ animationDelay: `${(groupIdx * items.length + i) * 60}ms` }}
                      >
                        <div className="absolute -left-4 top-4 w-2 h-2 rounded-full bg-primary-500 border-2 border-[var(--card-bg)] shadow-sm shadow-primary-500/20" />

                        <div
                          className={cn(
                            'relative z-10 flex items-center justify-center w-9 h-9 rounded-xl shrink-0 border',
                            'border-[var(--glass-border)]',
                            'transition-transform group-hover:scale-110 group-hover:shadow-md',
                            config.bg
                          )}
                        >
                          <Icon className={cn('w-4 h-4', config.color)} />
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-[var(--text)] truncate">
                              {activity.title}
                            </p>
                            <span
                              className={cn(
                                'text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md',
                                config.bg,
                                config.color
                              )}
                            >
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            {activity.description}
                          </p>
                        </div>

                        <span className="text-[11px] text-[var(--text-secondary)] whitespace-nowrap pt-1 font-medium">
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
