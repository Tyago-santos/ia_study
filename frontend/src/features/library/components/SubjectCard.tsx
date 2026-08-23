import { Trash2 } from 'lucide-react'
import { Button, Card } from '@/shared/components/ui'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { cn } from '@/shared/lib/utils'
import type { Subject, Topic } from '@/shared/types'
import { getTopicProgress } from '@/features/library/lib/subjectColors'

interface SubjectCardProps {
  subject: Subject
  topics: Topic[]
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

export function SubjectCard({ subject, topics, isSelected, onSelect, onDelete }: SubjectCardProps) {
  const Icon = getSubjectIcon(subject.icon)
  const { completed, total, percentage } = getTopicProgress(topics)

  return (
    <Card
      onClick={onSelect}
      className={cn('relative cursor-pointer overflow-hidden', isSelected && 'ring-2 ring-primary-500/50')}
    >
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${subject.color}, transparent 70%)` }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}cc)` }}
          >
            <Icon className="w-6 h-6 text-[var(--on-accent)]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text)] truncate">{subject.name}</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {total > 0 ? `${completed}/${total} assuntos` : 'Sem assuntos'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {total > 0 && (
        <div className="relative h-1 rounded-full bg-[var(--bg-secondary)] overflow-hidden mt-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: subject.color }}
          />
        </div>
      )}
    </Card>
  )
}
