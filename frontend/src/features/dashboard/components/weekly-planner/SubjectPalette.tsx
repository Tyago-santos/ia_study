import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { cn } from '@/shared/lib/utils'
import type { Subject } from '@/shared/types'

interface SubjectPaletteProps {
  subjects: Subject[]
  isOver: boolean
}

export function SubjectPalette({ subjects, isOver }: SubjectPaletteProps) {
  const { setNodeRef } = useDroppable({ id: 'subjects', data: { type: 'subjects' } })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-wrap gap-2 p-3 mb-5 rounded-xl border-2 border-dashed transition-colors',
        'bg-[var(--bg-secondary)] border-[var(--glass-border)]',
        isOver && 'border-primary-500 bg-primary-500/10'
      )}
    >
      {subjects.length === 0 && !isOver && (
        <p className="text-xs text-[var(--text-secondary)] px-1 py-1.5">
          Crie matérias na Biblioteca para vê-las aqui.
        </p>
      )}
      {subjects.map((subject) => (
        <DraggableSubjectChip key={subject.id} subject={subject} />
      ))}
    </div>
  )
}

function DraggableSubjectChip({ subject }: { subject: Subject }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `subject-${subject.id}`,
    data: { type: 'subject', subjectId: subject.id },
  })

  const Icon = getSubjectIcon(subject.icon)

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        backgroundColor: subject.color + '14',
        color: subject.color,
        border: `1px solid ${subject.color}30`,
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
        style={{ backgroundColor: subject.color + '22' }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: subject.color }} />
      </div>
      {subject.name}
    </div>
  )
}
