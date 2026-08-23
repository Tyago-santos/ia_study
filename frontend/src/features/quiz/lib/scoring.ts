import { RotateCcw, ThumbsUp, Trophy } from 'lucide-react'
import type { Quiz } from '@/shared/types'

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export function scoreColor(score: number): string {
  if (score >= 70) return 'text-success-500'
  if (score >= 40) return 'text-warning-500'
  return 'text-error-500'
}

export function scoreHex(score: number): string {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

export function scoreFeedback(percentage: number) {
  if (percentage >= 70) return { icon: Trophy, message: 'Excelente trabalho!' }
  if (percentage >= 40) return { icon: ThumbsUp, message: 'Bom, continue praticando!' }
  return { icon: RotateCcw, message: 'Vamos revisar o conteúdo!' }
}

export function summarizeQuizzes(quizzes: Quiz[] | undefined) {
  const list = quizzes ?? []
  const completed = list.filter((q) => q.score !== undefined)
  return {
    total: list.length,
    totalQuestions: list.reduce((sum, q) => sum + q.questions.length, 0),
    completed: completed.length,
    averageScore: completed.length
      ? Math.round(completed.reduce((sum, q) => sum + (q.score ?? 0), 0) / completed.length)
      : null,
  }
}
