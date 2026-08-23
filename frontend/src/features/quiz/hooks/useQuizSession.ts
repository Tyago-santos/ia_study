import { useState } from 'react'
import type { Quiz } from '@/shared/types'
import { useSubmitQuiz } from '@/features/quiz/hooks/useQuiz'

/**
 * Drives a single quiz run: which quiz is active, the current question,
 * the answers collected so far and the submission of the final result.
 */
export function useQuizSession(quizzes: Quiz[] | undefined) {
  const submitQuiz = useSubmitQuiz()
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const activeQuiz = quizzes?.find((q) => q.id === activeQuizId) ?? null

  const start = (id: string) => {
    setActiveQuizId(id)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const exit = () => {
    setActiveQuizId(null)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const answer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const next = () => {
    if (!activeQuiz) return
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      return
    }
    setShowResults(true)
    submitQuiz.mutate({ id: activeQuiz.id, answers })
  }

  return {
    activeQuiz,
    currentQuestion,
    answers,
    showResults,
    isSubmitting: submitQuiz.isPending,
    result: submitQuiz.data,
    start,
    exit,
    answer,
    next,
  }
}
