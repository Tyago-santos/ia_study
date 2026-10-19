import type { Flashcard } from '@/shared/types'

export const DIFFICULTY_STYLES: Record<
  Flashcard['difficulty'],
  { label: string; dot: string; badge: string }
> = {
  easy: {
    label: 'Fácil',
    dot: 'bg-success-500',
    badge: 'bg-success-500/15 text-success-500 border-success-500/30',
  },
  medium: {
    label: 'Médio',
    dot: 'bg-warning-500',
    badge: 'bg-warning-500/15 text-warning-500 border-warning-500/30',
  },
  hard: {
    label: 'Difícil',
    dot: 'bg-error-500',
    badge: 'bg-error-500/15 text-error-500 border-error-500/30',
  },
}
