import { useMemo } from 'react'
import { cn, formatDate, formatMinutes } from '@/shared/lib/utils'
import type { DailyStats } from '@/shared/types'
import {
  buildContributionGrid,
  getLevel,
  LEVEL_CLASSES,
  WEEKDAY_LABELS,
} from '@/features/statistics/lib/contributions'

interface ContributionCalendarProps {
  days: DailyStats[]
}

export function ContributionCalendar({ days }: ContributionCalendarProps) {
  const { weeks, monthMarkers, totalMinutes, activeDays } = useMemo(
    () => buildContributionGrid(days),
    [days]
  )

  if (weeks.length === 0) {
    return <p className="text-center text-[var(--text-secondary)] py-8">Nenhum dado disponível</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--text-secondary)]">
        {formatMinutes(totalMinutes)} estudados em {activeDays} dias nos últimos 12 meses
      </p>

      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1 min-w-max">
          <div className="flex gap-1 pl-6">
            {weeks.map((_, i) => {
              const marker = monthMarkers.find((m) => m.weekIndex === i)
              return (
                <div key={i} className="w-3 text-xs text-[var(--text-secondary)]">
                  {marker?.label ?? ''}
                </div>
              )
            })}
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <div key={i} className="w-4 h-3 text-xs leading-3 text-[var(--text-secondary)]">
                  {label}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={
                      day.inRange
                        ? `${day.minutes > 0 ? formatMinutes(day.minutes) : 'Sem atividade'} - ${formatDate(day.date)}`
                        : undefined
                    }
                    className={cn(
                      'w-3 h-3 rounded-sm',
                      day.inRange ? LEVEL_CLASSES[getLevel(day.minutes)] : 'bg-transparent'
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 text-xs text-[var(--text-secondary)]">
        <span>Menos</span>
        {LEVEL_CLASSES.map((cls, i) => (
          <div key={i} className={cn('w-3 h-3 rounded-sm', cls)} />
        ))}
        <span>Mais</span>
      </div>
    </div>
  )
}
