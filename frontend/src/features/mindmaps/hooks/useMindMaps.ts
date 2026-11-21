import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { generateMindMap } from '@/features/ai/services/generation.service'
import type { GenerationInput } from '@/features/ai/lib/generation.prompt'
import { mindmapsService } from '@/features/mindmaps/services/mindmaps.service'
import type { MindMapNode } from '@/shared/types'
import type { MindMapNodePayload } from '@/shared/services/mindMapsApi'

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

export function useCreateMindMapNode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mindMapId, data }: { mindMapId: string; data: MindMapNodePayload }) =>
      mindmapsService.createNode(mindMapId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })
      toast.success('Topico adicionado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar topico')
    },
  })
}

export function useUpdateMindMapNode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      mindMapId,
      nodeId,
      data,
    }: {
      mindMapId: string
      nodeId: string
      data: Partial<MindMapNodePayload>
    }) => mindmapsService.updateNode(mindMapId, nodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })
      toast.success('Topico atualizado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar topico')
    },
  })
}

export function useDeleteMindMapNode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mindMapId, nodeId }: { mindMapId: string; nodeId: string }) =>
      mindmapsService.deleteNode(mindMapId, nodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })
      toast.success('Topico excluido')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir topico')
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

export function useSaveMindMapNodes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      mindMapId,
      currentNodes,
      originalNodes,
    }: {
      mindMapId: string
      currentNodes: MindMapNode[]
      originalNodes: MindMapNode[]
    }) => mindmapsService.saveNodes(mindMapId, currentNodes, originalNodes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mindmaps.all })
      toast.success('Mapa mental salvo!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao salvar mapa mental')
    },
  })
}

export function useGenerateMindMapWithAI() {
  return useMutation({
    mutationFn: (input: GenerationInput) => generateMindMap(input),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar mapa mental com IA')
    },
  })
}