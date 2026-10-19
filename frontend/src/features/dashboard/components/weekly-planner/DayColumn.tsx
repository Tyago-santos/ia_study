import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Calendar } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { formatDuration, MAX_DURATION } from '@/features/dashboard/lib/duration'
import { useWeeklyPlannerStore } from '@/features/dashboard/store/weeklyPlanner.store'
import type { ScheduleEvent } from '@/shared/types'
import { StudyBlock } from './StudyBlock'
import { ScheduleEventBlock } from './ScheduleEventBlock'

interface DayColumnProps {
  dayName: string
  dayIndex: number
  isToday: boolean
  isOver: boolean
  events: ScheduleEvent[]
  onPostponeEvent: (event: ScheduleEvent) => void
}

export function DayColumn({
  dayName,
  dayIndex,
  isToday,
  isOver,
  events,
  onPostponeEvent,
}: DayColumnProps) {
  const { days } = useWeeklyPlannerStore()
  const blocks = days.find((d) => d.dayIndex === dayIndex)?.blocks ?? []
  const plannedMinutes = blocks.reduce((acc, b) => acc + b.duration, 0)
  const bookedMinutes = events.reduce((acc, e) => acc + (e.durationMinutes ?? 0), 0)
  const totalMinutes = plannedMinutes + bookedMinutes
  const isEmpty = blocks.length === 0 && events.length === 0
  const loadPct = Math.min(100, (totalMinutes / MAX_DURATION) * 100)

  const { setNodeRef } = useDroppable({
    id: `day-${dayIndex}`,
    data: { type: 'day', dayIndex },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'group relative flex flex-col gap-1.5 p-2 rounded-xl border-2 transition-all min-h-[170px]',
        // no mobile (faixa horizontal) cada coluna tem largura propria
        'w-[42vw] max-w-[220px] shrink-0 md:w-auto md:max-w-none md:shrink',
        isEmpty
          ? 'border-dashed border-[var(--glass-border)] bg-[var(--bg-secondary)]/40'
          : 'border-transparent bg-[var(--bg-secondary)]/20',
        isToday &&
          !isOver &&
          'border-primary-500/50 bg-primary-500/[0.06] shadow-[0_0_0_1px_rgba(0,255,0,0.05)]',
        isOver && 'border-primary-500 bg-primary-500/10 scale-[1.02]'
      )}
    >
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-wider',
              isToday ? 'text-[var(--accent-text)]' : 'text-[var(--text)]'
            )}
          >
            {dayName}
          </span>
          {isToday && (
            <span className="flex items-center justify-center w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-glow" />
          )}
        </div>
        {totalMinutes > 0 && (
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] tabular-nums">
            {formatDuration(totalMinutes)}
          </span>
        )}
      </div>

      <div className="h-1 rounded-full bg-[var(--bg-secondary)] overflow-hidden mb-1">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isToday
              ? 'bg-gradient-to-r from-primary-500 via-primary-400 to-tertiary-400'
              : 'bg-primary-500/40'
          )}
          style={{ width: `${loadPct}%` }}
        />
      </div>

      {events.map((event) => (
        <ScheduleEventBlock
          key={event.id}
          event={event}
          onPostpone={() => onPostponeEvent(event)}
        />
      ))}

      <SortableContext
        items={blocks.map((b) => `block-${b.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {blocks.map((block) => (
          <StudyBlock key={block.id} block={block} dayIndex={dayIndex} />
        ))}
      </SortableContext>

      {isEmpty && !isOver && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center transition-opacity group-hover:opacity-60">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-[var(--text-secondary)] opacity-30" />
            <p className="text-[10px] text-[var(--text-secondary)] opacity-30">
              Arraste matérias aqui
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
