import { useState } from 'react'
import { AiGenerateButton } from '@/features/ai/components/AiGenerateButton'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { FormModal } from '@/shared/components/ui/FormModal'
import { Input } from '@/shared/components/ui/Input'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonCard } from '@/shared/components/ui/Skeleton'
import { SummaryCard } from '../components/SummaryCard'
import { useSummaries } from '../hooks/useSummaries'
import { isDraftValid } from '../services/summaries.service'
import * as S from './style'

export function SummariesPage() {
  const { isLoading, subjects, summaries, getSubject, createSummary, removeSummary } =
    useSummaries()

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subjectId, setSubjectId] = useState<string | null>(null)

  const draft = { title, content, subjectId }

  const submit = () => {
    if (!isDraftValid(draft) || !subjectId) return

    createSummary.mutate(
      { subjectId, title: title.trim(), content: content.trim(), sourceType: 'text' },
      {
        onSuccess: () => {
          setIsCreating(false)
          setTitle('')
          setContent('')
        },
      },
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
        onAction={() => {
          setSubjectId(subjects[0]?.id ?? null)
          setIsCreating(true)
        }}
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

      <FormModal
        open={isCreating}
        title="Novo resumo"
        onClose={() => setIsCreating(false)}
        onSubmit={submit}
        submitLabel="Criar resumo"
        isSubmitting={createSummary.isPending}
        submitDisabled={!isDraftValid(draft)}
      >
        <S.FieldLabel>Matéria</S.FieldLabel>
        <FilterChips
          value={subjectId}
          onChange={setSubjectId}
          options={subjects.map((s) => ({ value: s.id, label: s.name, color: s.color }))}
        />

        <Input
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Leis de Newton"
        />
        <Input
          label="Conteúdo"
          value={content}
          onChangeText={setContent}
          placeholder="Escreva ou cole o resumo"
          multiline
          style={{ minHeight: 120, textAlignVertical: 'top' }}
        />
      </FormModal>
    </Screen>
  )
}
