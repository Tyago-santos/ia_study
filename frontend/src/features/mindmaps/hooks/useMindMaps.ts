import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { mindmapsService } from '@/features/mindmaps/services/mindmaps.service'

export function useMindMaps(subjectId?: string) {
  return useQuery({
    queryKey: [...queryKeys.mindmaps.list(), subjectId],
    queryFn: () => mindmapsService.getAll({ subjectId }),
  })
}

export function useCreateMindMap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mindmapsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })
      toast.success('Mapa mental criado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar mapa mental')
    },
  })
}

export function useUpdateMindMapNodes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mindmapsService.updateNodes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })
      toast.success('Mapa mental salvo!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao salvar mapa mental')
    },
  })
}

export function useDeleteMindMap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mindmapsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })
      toast.success('Mapa mental excluido')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir mapa mental')
    },
  })
}

export function useGenerateMindMapWithAI() {
  return useMutation({
    mutationFn: mindmapsService.generateWithAI,
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar mapa mental com IA')
    },
  })
}
