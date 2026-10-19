import { Check, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { ScheduleEvent } from '@/shared/types'
import { useDeleteEvent, useToggleEvent } from '@/features/schedule/hooks/useSchedule'
import { getDateInfo, TYPE_STYLES } from '@/features/schedule/lib/eventTypes'

interface EventRowProps {
  event: ScheduleEvent
  subjectName?: string
  subjectColor?: string
}

export function EventRow({ event, subjectName, subjectColor }: EventRowProps) {
  const toggleEvent = useToggleEvent()
  const deleteEvent = useDeleteEvent()
  const style = TYPE_STYLES[event.type]
  const Icon = style.icon
  const dateInfo = getDateInfo(event.date, event.completed)

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border transition-all group',
        'bg-[var(--card-bg)] border-[var(--border)] hover:shadow-md',
        event.completed && 'opacity-60'
      )}
    >
      <button
        type="button"
        onClick={() => toggleEvent.mutate(event.id)}
        className={cn(
          'mt-0.5 -m-1 p-1 flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 transition-colors',
          event.completed
            ? 'bg-primary-500 border-primary-500 text-[var(--on-accent)]'
            : 'border-[var(--border)] hover:border-primary-500'
        )}
      >
        {event.completed && <Check className="w-3.5 h-3.5" />}
      </button>

      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{ backgroundColor: `${style.color}18` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: style.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={cn(
              'text-sm font-semibold text-[var(--text)]',
              event.completed && 'line-through'
            )}
          >
            {event.title}
          </p>
          {subjectName && (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${subjectColor}18`, color: subjectColor }}
            >
              {subjectName}
            </span>
          )}
        </div>
        {event.description && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={cn(
              'text-[11px] font-semibold px-2 py-0.5 rounded-full',
              dateInfo.tone === 'overdue' && 'bg-error-500/15 text-[var(--danger)]',
              dateInfo.tone === 'today' && 'bg-primary-500/15 text-[var(--accent-text)]',
              dateInfo.tone === 'soon' && 'bg-warning-500/15 text-[var(--warning)]',
              dateInfo.tone === 'neutral' && 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
            )}
          >
            {dateInfo.label}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">{style.label}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => deleteEvent({ id: event.id, label: event.title })}
        aria-label={`Remover evento ${event.title}`}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:bg-error-500/15 hover:text-[var(--danger)] transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
