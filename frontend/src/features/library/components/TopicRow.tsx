import { CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Topic } from '@/shared/types'
import { useDeleteTopic, useToggleTopic } from '@/features/library/hooks/useTopics'

interface TopicRowProps {
  topic: Topic
}

export function TopicRow({ topic }: TopicRowProps) {
  const toggleTopic = useToggleTopic()
  const deleteTopic = useDeleteTopic()

  return (
    <div className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
      <button type="button" onClick={() => toggleTopic.mutate(topic.id)} className="shrink-0">
        {topic.completed ? (
          <CheckCircle2 className="w-4 h-4 text-[var(--accent-text)]" />
        ) : (
          <Circle className="w-4 h-4 text-[var(--text-secondary)]" />
        )}
      </button>
      <span
        className={cn(
          'flex-1 text-sm',
          topic.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text)]'
        )}
      >
        {topic.name}
      </span>
      <button
        type="button"
        onClick={() => deleteTopic({ id: topic.id, label: topic.name })}
        aria-label={`Remover assunto ${topic.name}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5 text-[var(--text-secondary)] hover:text-[var(--danger)]" />
      </button>
    </div>
  )
}
