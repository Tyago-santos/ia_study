import { Layers } from 'lucide-react'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { cn } from '@/shared/lib/utils'
import type { Subject } from '@/shared/types'

interface SubjectFilterProps {
  subjects: Subject[]
  value: string | null
  onChange: (subjectId: string | null) => void
}

export function SubjectFilter({ subjects, value, onChange }: SubjectFilterProps) {
  if (subjects.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors',
          value === null
            ? 'border-primary-500/40 bg-primary-500/15 text-[var(--accent-text)]'
            : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
        )}
      >
        <Layers className="w-3.5 h-3.5" />
        Todas
      </button>
      {subjects.map((subject) => {
        const Icon = getSubjectIcon(subject.icon)
        const active = value === subject.id
        return (
          <button
            key={subject.id}
            type="button"
            onClick={() => onChange(active ? null : subject.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors',
              active
                ? 'border-transparent'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            )}
            style={active ? { backgroundColor: `${subject.color}26`, color: subject.color } : undefined}
          >
            <Icon className="w-3.5 h-3.5" />
            {subject.name}
          </button>
        )
      })}
    </div>
  )
}
