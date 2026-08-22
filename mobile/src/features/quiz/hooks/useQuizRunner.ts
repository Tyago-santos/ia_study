import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import { quizService } from '@/shared/services/dataStore'
import type { Quiz } from '@/shared/types'
import type { QuizResult } from '../services/quiz.service'

/**
 * Sessao de resposta de um quiz: questao atual, respostas e envio.
 *
 * O estado nasce e morre aqui — sair no meio descarta tudo de proposito, ja
 * que um quiz respondido pela metade nao vale nota.
 */
export function useQuizRunner() {
  const queryClient = useQueryClient()

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  const submitQuiz = useMutation({
    mutationFn: quizService.submit,
    onSuccess: (data) => {
      setResult(data)
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all })
    },
  })

  const start = (quiz: Quiz) => {
    setActiveQuiz(quiz)
    setQuestionIndex(0)
    setAnswers({})
    setResult(null)
  }

  const exit = () => {
    setActiveQuiz(null)
    setQuestionIndex(0)
    setAnswers({})
    setResult(null)
  }

  return {
    activeQuiz,
    questionIndex,
    answers,
    result,
    isSubmitting: submitQuiz.isPending,
    start,
    exit,
    answer: (questionId: string, optionIndex: number) =>
      setAnswers((current) => ({ ...current, [questionId]: optionIndex })),
    next: () => setQuestionIndex((index) => index + 1),
    submit: () => {
      if (!activeQuiz) return
      submitQuiz.mutate({ quizId: activeQuiz.id, answers })
    },
  }
}
