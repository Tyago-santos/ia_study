import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { TYPE_STYLES } from '@/features/schedule/lib/eventTypes'
import type { ScheduleEvent } from '@/shared/types'
import { formatDuration } from '@/features/dashboard/lib/duration'

interface ScheduleEventBlockProps {
  event: ScheduleEvent
  onPostpone: () => void
}

/** Compromisso ja marcado num dia: item fixo, arrastavel para outro dia. */
export function ScheduleEventBlock({ event, onPostpone }: ScheduleEventBlockProps) {
  const { label: _label, icon: Icon, color } = TYPE_STYLES[event.type]
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `event-${event.id}`,
    data: { type: 'event', eventId: event.id, date: event.date },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        borderColor: `${color}35`,
        backgroundImage: `linear-gradient(135deg, ${color}12, transparent 60%)`,
      }}
      className={cn(
        'group relative rounded-lg border overflow-hidden',
        isDragging && 'opacity-0'
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: color }} />
      <div className="relative flex items-center gap-1.5 pl-3 pr-2 py-2">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 shrink-0 cursor-grab active:cursor-grabbing"
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>

        <span className="flex-1 min-w-0 truncate">
          <span className="text-xs font-semibold text-[var(--text)] block truncate">
            {event.title}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] block truncate">
            {new Date(event.date).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {event.durationMinutes ? ` · ${formatDuration(event.durationMinutes)}` : ''}
          </span>
        </span>

        <button
          type="button"
          onClick={onPostpone}
          title="Adiar uma semana"
          className="flex items-center justify-center w-6 h-6 rounded shrink-0 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-opacity opacity-60 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function ScheduleEventOverlayCard({ event }: { event: ScheduleEvent }) {
  const { icon: Icon, color } = TYPE_STYLES[event.type]

  return (
    <div
      className="relative rounded-lg border overflow-hidden shadow-xl scale-[1.02] rotate-1 cursor-grabbing min-w-[160px]"
      style={{
        borderColor: `${color}35`,
        backgroundColor: 'var(--card-bg)',
        backgroundImage: `linear-gradient(135deg, ${color}12, transparent 60%)`,
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: color }} />
      <div className="relative flex items-center gap-1.5 pl-3 pr-2 py-2">
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
        <span className="flex-1 min-w-0 truncate">
          <span className="text-xs font-semibold text-[var(--text)] block truncate">
            {event.title}
          </span>
        </span>
      </div>
    </div>
  )
}
