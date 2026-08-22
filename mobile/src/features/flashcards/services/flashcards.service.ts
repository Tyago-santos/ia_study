import { Tints } from '@/shared/constants/theme'
import type { Flashcard } from '@/shared/types'

export const DIFFICULTY_LABELS: Record<Flashcard['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

export const DIFFICULTY_COLORS: Record<Flashcard['difficulty'], string> = {
  easy: Tints.emerald,
  medium: Tints.amber,
  hard: Tints.red,
}

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

export interface FlashcardDraft {
  front: string
  back: string
  subjectId: string | null
}

/** Cartao sem materia, pergunta ou resposta nao pode ser salvo. */
export function isDraftValid(draft: FlashcardDraft): boolean {
  return Boolean(draft.subjectId && draft.front.trim() && draft.back.trim())
}

/** Filtra por materia; `null` significa "todas". */
export function filterBySubject(cards: Flashcard[], subjectId: string | null): Flashcard[] {
  if (!subjectId) return cards
  return cards.filter((card) => card.subjectId === subjectId)
}
