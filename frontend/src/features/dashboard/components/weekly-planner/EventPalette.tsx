import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { TYPE_STYLES } from '@/features/schedule/lib/eventTypes'
import type { ScheduleEvent } from '@/shared/types'
import { cn } from '@/shared/lib/utils'

interface EventPaletteProps {
  events: ScheduleEvent[]
}

/** Compromissos fora desta semana, ainda sem um dia — arraste para posicionar. */
export function EventPalette({ events }: EventPaletteProps) {
  if (events.length === 0) return null

  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
        Compromissos a posicionar
      </p>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border-2 border-dashed bg-[var(--bg-secondary)] border-[var(--glass-border)]">
        {events.map((event) => (
          <DraggableEventChip key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

function DraggableEventChip({ event }: { event: ScheduleEvent }) {
  const { label: _label, icon: Icon, color } = TYPE_STYLES[event.type]
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `event-${event.id}`,
    data: { type: 'event', eventId: event.id, date: event.date },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        backgroundColor: color + '14',
        color,
        border: `1px solid ${color}30`,
        touchAction: 'none',
      }}
      className={cn(
        'flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg text-sm font-medium cursor-grab active:cursor-grabbing select-none',
        !isDragging && 'transition-all hover:-translate-y-0.5 hover:shadow-md',
        isDragging && 'shadow-lg scale-105 rotate-2 z-10 relative'
      )}
    >
      <div
        className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
        style={{ backgroundColor: color + '22' }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      {event.title}
    </div>
  )
}
