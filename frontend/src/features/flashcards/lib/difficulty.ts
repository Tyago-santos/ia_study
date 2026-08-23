import type { Flashcard } from '@/shared/types'

export const DIFFICULTY_STYLES: Record<
  Flashcard['difficulty'],
  { label: string; dot: string; badge: string }
> = {
  easy: {
    label: 'Fácil',
    dot: 'bg-success-500',
    badge: 'bg-success-500/10 text-success-600 border-success-500/20',
  },
  medium: {
    label: 'Médio',
    dot: 'bg-warning-500',
    badge: 'bg-warning-500/10 text-warning-600 border-warning-500/20',
  },
  hard: {
    label: 'Difícil',
    dot: 'bg-error-500',
    badge: 'bg-error-500/10 text-error-600 border-error-500/20',
  },
}
