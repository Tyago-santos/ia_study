import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardSkeleton, EmptyState, ErrorState } from '@/shared/components/ui'
import { useDeleteFlashcard, useFlashcards } from '@/features/flashcards/hooks/useFlashcards'
import { useFlashcardReviewSession } from '@/features/flashcards/hooks/useFlashcardReviewSession'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { CreateFlashcardModal } from '../components/CreateFlashcardModal'
import { FlashcardDeckRow } from '../components/FlashcardDeckRow'
import { FlashcardItem } from '../components/FlashcardItem'
import { FlashcardReviewComplete } from '../components/FlashcardReviewComplete'
import { FlashcardReviewRunner } from '../components/FlashcardReviewRunner'
import { FlashcardsHeader } from '../components/FlashcardsHeader'

/** Frente do cartao encurtada para caber no toast de undo. */
function toCardLabel(front: string): string {
  const clean = front.replace(/\s+/g, ' ').trim()
  return clean.length > 40 ? `${clean.slice(0, 40)}...` : clean
}

export function FlashcardsPage() {
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const { data, isLoading, error, refetch } = useFlashcards()
  const { data: subjects } = useSubjects()
  const deleteFlashcard = useDeleteFlashcard()

  const flashcards = data?.flashcards ?? []
  const getSubject = (subjectId: string) => subjects?.find((s) => s.id === subjectId)

  // Agrupamento apenas de apresentacao: linhas da lista "Seus Decks de Estudo".
  const deckSubjectIds = Array.from(new Set(flashcards.map((card) => card.subjectId)))
  const decks = deckSubjectIds.map((subjectId) => ({
    subjectId,
    cards: flashcards.filter((card) => card.subjectId === subjectId),
  }))

  const review = useFlashcardReviewSession(flashcards)

  if (error) {
    return <ErrorState message="Erro ao carregar flashcards" onRetry={refetch} />
  }

  if (review.isActive) {
    if (review.showResults) {
      return (
        <FlashcardReviewComplete
          total={review.total}
          onRestart={review.start}
          onBack={review.exit}
        />
      )
    }

    if (review.currentCard) {
      return (
        <FlashcardReviewRunner
          card={review.currentCard}
          subject={getSubject(review.currentCard.subjectId)}
          index={review.index}
          total={review.total}
          flipped={review.flipped}
          onFlip={review.flip}
          onRate={review.rate}
          onExit={review.exit}
        />
      )
    }
  }

  return (
    <div className="space-y-6">
      <FlashcardsHeader
        total={flashcards.length}
        onCreate={() => setIsCreating(true)}
        onReview={review.start}
      />

      <CreateFlashcardModal open={isCreating} onClose={() => setIsCreating(false)} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : flashcards.length > 0 ? (
        <>
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-[var(--text)]">Seus Decks de Estudo</h2>
              <span className="rounded-full bg-primary-500/15 px-2.5 py-1 text-[11px] font-bold text-primary-300">
                {decks.length}
              </span>
            </div>
            <div className="space-y-4">
              {decks.map((deck) => (
                <FlashcardDeckRow
                  key={deck.subjectId}
                  subject={getSubject(deck.subjectId)}
                  cards={deck.cards}
                  onReview={review.start}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary-300" />
              Passe o mouse sobre um card (ou toque nele) para virar e ver a resposta
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {flashcards.map((flashcard, i) => (
                <FlashcardItem
                  key={flashcard.id}
                  flashcard={flashcard}
                  subject={getSubject(flashcard.subjectId)}
                  index={i}
                  flipped={flippedId === flashcard.id}
                  onFlip={() => setFlippedId(flippedId === flashcard.id ? null : flashcard.id)}
                  onDelete={() =>
                    deleteFlashcard({ id: flashcard.id, label: toCardLabel(flashcard.front) })
                  }
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              title="Nenhum flashcard criado"
              description="Clique em 'Criar Flashcard' para começar!"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
