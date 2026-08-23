import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { subjectsService } from '@/features/library/services/subjects.service'

export function useSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.getAll,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subjectsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all })
      toast.success('Matéria criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar matéria')
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subjectsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all })
      toast.success('Matéria excluída!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir matéria')
    },
  })
}
