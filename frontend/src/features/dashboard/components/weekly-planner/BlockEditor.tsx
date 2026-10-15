import { useEffect, useRef } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { PlanBlock } from '@/shared/types'
import { useTopics } from '@/features/library/hooks/useTopics'
import { DURATION_STEP, formatDuration } from '@/features/dashboard/lib/duration'
import { useWeeklyPlannerStore } from '@/features/dashboard/store/weeklyPlanner.store'

interface BlockEditorProps {
  block: PlanBlock
  dayIndex: number
  onClose: () => void
}

export function BlockEditor({ block, dayIndex, onClose }: BlockEditorProps) {
  const { updateDuration, updateTopic, removeBlock } = useWeeklyPlannerStore()
  const { data: topics } = useTopics()
  const ref = useRef<HTMLDivElement>(null)

  const subjectTopics = topics?.filter((t) => t.subjectId === block.subjectId) ?? []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const timeout = setTimeout(() => document.addEventListener('mousedown', handleClick), 0)
    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClose])

  return (
    <div ref={ref} className="absolute bottom-full left-0 right-0 mb-2 z-50">
      <div className="flex flex-col gap-1.5 p-2 rounded-lg shadow-lg border bg-[var(--card-bg)] border-[var(--glass-border)]">
        {subjectTopics.length > 0 && (
          <select
            value={block.topicId ?? ''}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const topic = subjectTopics.find((t) => t.id === e.target.value)
              updateTopic(dayIndex, block.id, topic?.id, topic?.name)
            }}
            className="w-full h-8 px-2 rounded-md border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            <option value="">O que estudar? (geral)</option>
            {subjectTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.completed ? '✓ ' : ''}
                {topic.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              updateDuration(dayIndex, block.id, block.duration - DURATION_STEP)
            }}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-[var(--bg-secondary)] active:scale-95 transition-all"
          >
            <Minus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>
          <span className="text-xs font-bold text-[var(--text)] tabular-nums min-w-[40px] text-center select-none">
            {formatDuration(block.duration)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              updateDuration(dayIndex, block.id, block.duration + DURATION_STEP)
            }}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-[var(--bg-secondary)] active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>
          <div className="w-px h-5 bg-[var(--border)] mx-1" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeBlock(dayIndex, block.id)
              onClose()
            }}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-error-500/15 active:scale-95 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-[var(--danger)]" />
          </button>
        </div>
      </div>
    </div>
  )
}
