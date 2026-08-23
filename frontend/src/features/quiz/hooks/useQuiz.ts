import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { quizService } from '@/features/quiz/services/quiz.service'

export function useQuizzes(subjectId?: string) {
  return useQuery({
    queryKey: [...queryKeys.quiz.list(), subjectId],
    queryFn: () => quizService.getAll({ subjectId }),
  })
}

export function useCreateQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quizService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all })
      toast.success('Quiz criado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar quiz')
    },
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: Record<string, number> }) =>
      quizService.submit(id, { answers }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
      toast.success(`Quiz finalizado! Você acertou ${data.percentage}%`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar respostas')
    },
  })
}

export function useGenerateQuizWithAI() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subjectId, topic }: { subjectId: string; topic?: string }) =>
      quizService.generateWithAI(subjectId, topic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all })
      toast.success('Quiz gerado com IA!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar quiz')
    },
  })
}
