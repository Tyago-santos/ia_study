import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { mindMapsService, subjectsService } from '@/shared/services/dataStore'
import { totalNodes } from '../services/mindmaps.service'

/** Mapas mentais e as acoes sobre mapas e nos. */
export function useMindMaps() {
  const queryClient = useQueryClient()

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: mindMaps, isLoading: loadingMindMaps } = useQuery({
    queryKey: queryKeys.mindmaps.list(),
    queryFn: mindMapsService.list,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })

  const createMap = useMutation({ mutationFn: mindMapsService.create, onSuccess: invalidate })
  const removeMap = useMutation({ mutationFn: mindMapsService.remove, onSuccess: invalidate })
  const addNode = useMutation({ mutationFn: mindMapsService.addNode, onSuccess: invalidate })
  const removeNode = useMutation({ mutationFn: mindMapsService.removeNode, onSuccess: invalidate })
  const updateNode = useMutation({ mutationFn: mindMapsService.updateNode, onSuccess: invalidate })

  return {
    isLoading: loadingSubjects || loadingMindMaps,
    subjects: subjects ?? [],
    mindMaps: mindMaps ?? [],
    getSubject: (id: string) => subjects?.find((s) => s.id === id),
    findMap: (id: string | null) => mindMaps?.find((m) => m.id === id) ?? null,
    nodeCount: totalNodes(mindMaps ?? []),
    createMap,
    removeMap,
    addNode,
    removeNode,
    updateNode,
  }
}
