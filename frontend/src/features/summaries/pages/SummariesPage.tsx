import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardSkeleton, EmptyState, ErrorState } from '@/shared/components/ui'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useSummaries } from '@/features/summaries/hooks/useSummaries'
import { countBySourceType } from '@/features/summaries/lib/sourceTypes'
import { CreateSummaryModal } from '../components/CreateSummaryModal'
import { SummariesHeader } from '../components/SummariesHeader'
import { SummaryCard } from '../components/SummaryCard'

export function SummariesPage() {
  const [isCreating, setIsCreating] = useState(false)

  const { data: summaries, isLoading, error, refetch } = useSummaries()
  const { data: subjects } = useSubjects()

  const getSubject = (subjectId: string) => subjects?.find((s) => s.id === subjectId)

  if (error) {
    return <ErrorState message="Erro ao carregar resumos" onRetry={refetch} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SummariesHeader
        total={summaries?.length ?? 0}
        pdfCount={countBySourceType(summaries, 'pdf')}
        imageCount={countBySourceType(summaries, 'image')}
        onCreate={() => setIsCreating(true)}
      />

      <CreateSummaryModal open={isCreating} onClose={() => setIsCreating(false)} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : summaries && summaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((summary, i) => (
            <SummaryCard
              key={summary.id}
              summary={summary}
              subject={getSubject(summary.subjectId)}
              index={i}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={<FileText className="w-12 h-12" />}
              title="Nenhum resumo criado"
              description="Clique em 'Criar Resumo' para começar!"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
