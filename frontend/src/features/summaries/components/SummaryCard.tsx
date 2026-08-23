import { Sparkles } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { formatDate } from '@/shared/lib/utils'
import type { Subject, Summary } from '@/shared/types'
import { getSourceStyle } from '@/features/summaries/lib/sourceTypes'

interface SummaryCardProps {
  summary: Summary
  subject?: Subject
  index: number
}

export function SummaryCard({ summary, subject, index }: SummaryCardProps) {
  const source = getSourceStyle(summary.sourceType)
  const SourceIcon = source.icon
  const SubjectIcon = getSubjectIcon(subject?.icon)
  const accent = subject?.color ?? 'var(--color-primary-500)'

  return (
    <Card
      className="relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'backwards' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }}
      />
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ backgroundColor: accent + '18' }}
          >
            <SubjectIcon className="w-5 h-5" style={{ color: accent }} />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate">{summary.title}</CardTitle>
            {subject && (
              <span className="text-xs text-[var(--text-secondary)] truncate block mt-0.5">
                {subject.name}
              </span>
            )}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] shrink-0">
          <SourceIcon className="w-3 h-3" />
          {source.label}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3 leading-relaxed">
          {summary.content}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)]">{formatDate(summary.createdAt)}</span>
          <Button variant="ghost" size="sm">
            <Sparkles className="w-4 h-4 mr-1 text-[var(--accent-text)]" />
            Gerar com IA
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
