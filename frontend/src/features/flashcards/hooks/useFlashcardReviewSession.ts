import { useState } from 'react'
import type { Flashcard } from '@/shared/types'
import { useReviewFlashcard } from '@/features/flashcards/hooks/useFlashcards'

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Drives a review session: a shuffled pass through every flashcard, virado
 * card a card, com autoavaliacao (facil/medio/dificil) que alimenta a
 * repeticao espacada no backend (`POST /flashcards/:id/review`).
 */
export function useFlashcardReviewSession(flashcards: Flashcard[] | undefined) {
  const reviewFlashcard = useReviewFlashcard()
  const [queue, setQueue] = useState<Flashcard[]>([])
  const [isActive, setIsActive] = useState(false)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const currentCard = queue[index] ?? null

  const start = () => {
    if (!flashcards || flashcards.length === 0) return
    setQueue(shuffle(flashcards))
    setIndex(0)
    setFlipped(false)
    setShowResults(false)
    setIsActive(true)
  }

  const exit = () => {
    setIsActive(false)
    setShowResults(false)
    setQueue([])
    setIndex(0)
    setFlipped(false)
  }

  const flip = () => setFlipped((prev) => !prev)

  const rate = (difficulty: Flashcard['difficulty']) => {
    if (!currentCard) return
    reviewFlashcard.mutate({ id: currentCard.id, difficulty })

    if (index < queue.length - 1) {
      setIndex((prev) => prev + 1)
      setFlipped(false)
      return
    }
    setShowResults(true)
  }

  return {
    isActive,
    showResults,
    currentCard,
    index,
    total: queue.length,
    flipped,
    start,
    exit,
    flip,
    rate,
  }
}
