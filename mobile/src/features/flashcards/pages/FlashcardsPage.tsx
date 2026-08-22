import { Ionicons } from '@expo/vector-icons'
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
import type { Flashcard } from '@/shared/types'
import { FlashcardItem } from '../components/FlashcardItem'
import { useFlashcards } from '../hooks/useFlashcards'
import {
  DIFFICULTIES,
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  filterBySubject,
  isDraftValid,
} from '../services/flashcards.service'
import * as S from './style'

export function FlashcardsPage() {
  const { isLoading, subjects, flashcards, getSubject, createFlashcard, removeFlashcard } =
    useFlashcards()

  const [flippedId, setFlippedId] = useState<string | null>(null)
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [difficulty, setDifficulty] = useState<Flashcard['difficulty']>('medium')
  const [subjectId, setSubjectId] = useState<string | null>(null)

  const visible = filterBySubject(flashcards, subjectFilter)
  const draft = { front, back, subjectId }

  const submit = () => {
    if (!isDraftValid(draft) || !subjectId) return

    createFlashcard.mutate(
      { subjectId, front: front.trim(), back: back.trim(), difficulty },
      {
        onSuccess: () => {
          setIsCreating(false)
          setFront('')
          setBack('')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <Screen scroll>
        <PageHeader title="Flashcards" subtitle="Carregando..." />
        <SkeletonCard lines={2} style={{ marginTop: 16, marginBottom: 12 }} />
        <SkeletonCard lines={2} style={{ marginBottom: 12 }} />
        <SkeletonCard lines={2} />
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <PageHeader
        title="Flashcards"
        subtitle={`${flashcards.length} cartões para revisar`}
        actionLabel="Criar"
        onAction={() => {
          setSubjectId(subjects[0]?.id ?? null)
          setIsCreating(true)
        }}
      />

      <S.Filters>
        <FilterChips
          value={subjectFilter}
          onChange={setSubjectFilter}
          options={[
            { value: null, label: 'Todas' },
            ...subjects.map((s) => ({ value: s.id, label: s.name, color: s.color })),
          ]}
        />
      </S.Filters>

      <AiGenerateButton kind="flashcards" />

      <S.Hint>
        <Ionicons name="sparkles" size={12} /> Toque no cartão para ver a resposta
      </S.Hint>

      {visible.length > 0 ? (
        visible.map((flashcard) => (
          <FlashcardItem
            key={flashcard.id}
            flashcard={flashcard}
            subject={getSubject(flashcard.subjectId)}
            flipped={flippedId === flashcard.id}
            onFlip={() => setFlippedId(flippedId === flashcard.id ? null : flashcard.id)}
            onRemove={() => removeFlashcard.mutate(flashcard.id)}
          />
        ))
      ) : (
        <SectionCard>
          <EmptyState
            icon="layers-outline"
            title="Nenhum flashcard"
            description="Toque em Criar para adicionar seu primeiro cartão."
          />
        </SectionCard>
      )}

      <FormModal
        open={isCreating}
        title="Novo flashcard"
        onClose={() => setIsCreating(false)}
        onSubmit={submit}
        submitLabel="Criar flashcard"
        isSubmitting={createFlashcard.isPending}
        submitDisabled={!isDraftValid(draft)}
      >
        <S.FieldLabel>Matéria</S.FieldLabel>
        <FilterChips
          value={subjectId}
          onChange={setSubjectId}
          options={subjects.map((s) => ({ value: s.id, label: s.name, color: s.color }))}
        />

        <Input
          label="Pergunta"
          value={front}
          onChangeText={setFront}
          placeholder="Frente do cartão"
          multiline
        />
        <Input
          label="Resposta"
          value={back}
          onChangeText={setBack}
          placeholder="Verso do cartão"
          multiline
        />

        <S.FieldLabel>Dificuldade</S.FieldLabel>
        <FilterChips
          value={difficulty}
          onChange={(value) => setDifficulty((value as Flashcard['difficulty']) ?? 'medium')}
          options={DIFFICULTIES.map((d) => ({
            value: d,
            label: DIFFICULTY_LABELS[d],
            color: DIFFICULTY_COLORS[d],
          }))}
        />
      </FormModal>
    </Screen>
  )
}
