import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import { subjectsService, topicsService } from '@/shared/services/dataStore'
import { useWeeklyPlannerStore } from '@/features/dashboard/store/weeklyPlanner'
import { groupTopicsBySubject, plannedMinutesByTopic } from '../services/library.service'

/** Materias, assuntos e o tempo que o planner reservou para cada assunto. */
export function useLibrary() {
  const queryClient = useQueryClient()

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: topics, isLoading: loadingTopics } = useQuery({
    queryKey: queryKeys.topics.list(),
    queryFn: topicsService.list,
  })

  const plannerDays = useWeeklyPlannerStore((s) => s.days)

  const invalidateSubjects = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all })
  const invalidateTopics = () => queryClient.invalidateQueries({ queryKey: queryKeys.topics.all })

  const createSubject = useMutation({ mutationFn: subjectsService.create, onSuccess: invalidateSubjects })
  const removeSubject = useMutation({
    mutationFn: subjectsService.remove,
    // Remover a materia leva os assuntos junto, entao as duas listas caem.
    onSuccess: () => {
      invalidateSubjects()
      invalidateTopics()
    },
  })
  const createTopic = useMutation({ mutationFn: topicsService.create, onSuccess: invalidateTopics })
  const toggleTopic = useMutation({ mutationFn: topicsService.toggle, onSuccess: invalidateTopics })

  const topicsBySubject = useMemo(() => groupTopicsBySubject(topics ?? []), [topics])
  const plannedByTopic = useMemo(() => plannedMinutesByTopic(plannerDays), [plannerDays])

  return {
    isLoading: loadingSubjects || loadingTopics,
    subjects: subjects ?? [],
    topics: topics ?? [],
    topicsBySubject,
    plannedByTopic,
    completedTopics: (topics ?? []).filter((t) => t.completed).length,
    createSubject,
    removeSubject,
    createTopic,
    toggleTopic,
  }
}
