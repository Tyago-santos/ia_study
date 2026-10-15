import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { PlanBlock } from '@/shared/types'
import { formatDuration } from '@/features/dashboard/lib/duration'
import { BlockEditor } from './BlockEditor'

interface StudyBlockProps {
  block: PlanBlock
  dayIndex: number
}

export function StudyBlock({ block, dayIndex }: StudyBlockProps) {
  const [showEditor, setShowEditor] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `block-${block.id}`,
    data: { type: 'block', dayIndex, blockId: block.id },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('relative group', isDragging && 'opacity-0')}
    >
      <div
        onClick={(e) => {
          e.stopPropagation()
          setShowEditor((v) => !v)
        }}
        className={cn(
          'relative rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden',
          'bg-[var(--card-bg)] hover:shadow-md hover:-translate-y-px',
          showEditor && 'ring-2 ring-primary-500/40'
        )}
        style={{
          borderColor: `${block.subjectColor}35`,
          backgroundImage: `linear-gradient(135deg, ${block.subjectColor}12, transparent 60%)`,
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: block.subjectColor }}
        />

        <div className="relative flex items-center gap-1.5 pl-3 pr-2 py-2">
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 rounded cursor-grab active:cursor-grabbing',
              'hover:bg-[var(--bg-secondary)] shrink-0 transition-colors',
              // no toque nao existe hover: alca fica sempre visivel. So esconde no
              // desktop (sm+) onde o mouse revela no hover.
              'opacity-60 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
            )}
          >
            <GripVertical className="w-4 h-4 text-[var(--text-secondary)]" />
          </div>

          <span className="flex-1 min-w-0 truncate">
            <span className="text-xs font-semibold text-[var(--text)] block truncate">
              {block.subjectName}
            </span>
            {block.topicName && (
              <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                {block.topicName}
              </span>
            )}
          </span>

          <span
            className="text-[10px] font-bold whitespace-nowrap tabular-nums px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${block.subjectColor}18`,
              color: block.subjectColor,
            }}
          >
            {formatDuration(block.duration)}
          </span>
        </div>
      </div>

      {showEditor && (
        <BlockEditor block={block} dayIndex={dayIndex} onClose={() => setShowEditor(false)} />
      )}
    </div>
  )
}

export function StudyBlockCard({ block }: { block: PlanBlock }) {
  return (
    <div
      className="relative rounded-lg border overflow-hidden shadow-xl scale-[1.02] rotate-1 cursor-grabbing min-w-[160px]"
      style={{
        borderColor: `${block.subjectColor}35`,
        backgroundColor: 'var(--card-bg)',
        backgroundImage: `linear-gradient(135deg, ${block.subjectColor}12, transparent 60%)`,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: block.subjectColor }}
      />
      <div className="relative flex items-center gap-1.5 pl-3 pr-2 py-2">
        <div className="flex items-center justify-center w-5 h-5 rounded shrink-0">
          <GripVertical className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        </div>
        <span className="flex-1 min-w-0 truncate">
          <span className="text-xs font-semibold text-[var(--text)] block truncate">
            {block.subjectName}
          </span>
          {block.topicName && (
            <span className="text-[10px] text-[var(--text-secondary)] block truncate">
              {block.topicName}
            </span>
          )}
        </span>
        <span
          className="text-[10px] font-bold whitespace-nowrap tabular-nums px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: `${block.subjectColor}18`,
            color: block.subjectColor,
          }}
        >
          {formatDuration(block.duration)}
        </span>
      </div>
    </div>
  )
}
