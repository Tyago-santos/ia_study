import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { quizService, subjectsService } from '@/shared/services/dataStore'
import { averageScore, completedQuizzes } from '../services/quiz.service'

/** Catalogo de quizzes e o resumo de desempenho mostrado no topo da lista. */
export function useQuizzes() {
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: quizzes, isLoading: loadingQuizzes } = useQuery({
    queryKey: queryKeys.quiz.list(),
    queryFn: () => quizService.list(),
  })

  return {
    isLoading: loadingSubjects || loadingQuizzes,
    subjects: subjects ?? [],
    quizzes: quizzes ?? [],
    getSubject: (id: string) => subjects?.find((s) => s.id === id),
    completedCount: completedQuizzes(quizzes ?? []).length,
    average: averageScore(quizzes ?? []),
  }
}
