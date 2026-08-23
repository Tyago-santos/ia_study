import { useState } from 'react'
import { AiGenerateButton } from '@/features/ai/components/AiGenerateButton'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonCard } from '@/shared/components/ui/Skeleton'
import { SummaryCard } from '../components/SummaryCard'
import { useSummaries } from '../hooks/useSummaries'
import { SummaryEditorPage } from './SummaryEditorPage'
import * as S from './style'

export function SummariesPage() {
  const { isLoading, subjects, summaries, getSubject, createSummary, removeSummary } =
    useSummaries()

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  if (isCreating) {
    return (
      <SummaryEditorPage
        subjects={subjects}
        defaultSubjectId={subjects[0]?.id ?? null}
        isSubmitting={createSummary.isPending}
        onClose={() => setIsCreating(false)}
        onSubmit={(draft) =>
          createSummary.mutate(
            { ...draft, sourceType: 'text' },
            { onSuccess: () => setIsCreating(false) },
          )
        }
      />
    )
  }

  if (isLoading) {
    return (
      <Screen scroll>
        <PageHeader title="Resumos" subtitle="Carregando..." />
        <SkeletonCard lines={2} style={{ marginBottom: 12 }} />
        <SkeletonCard lines={2} style={{ marginBottom: 12 }} />
        <SkeletonCard lines={2} />
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <PageHeader
        title="Resumos"
        subtitle={`${summaries.length} resumos salvos`}
        actionLabel="Criar"
        onAction={() => setIsCreating(true)}
      />

      <AiGenerateButton kind="summary" />

      <S.List>
        {summaries.length > 0 ? (
          summaries.map((summary) => (
            <SummaryCard
              key={summary.id}
              summary={summary}
              subject={getSubject(summary.subjectId)}
              expanded={expandedId === summary.id}
              onToggle={() => setExpandedId(expandedId === summary.id ? null : summary.id)}
              onRemove={() => removeSummary.mutate(summary.id)}
            />
          ))
        ) : (
          <SectionCard>
            <EmptyState
              icon="document-text-outline"
              title="Nenhum resumo criado"
              description="Toque em Criar para salvar seu primeiro resumo."
            />
          </SectionCard>
        )}
      </S.List>
    </Screen>
  )
}
