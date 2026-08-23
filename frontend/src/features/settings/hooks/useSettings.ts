import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { settingsService } from '@/features/settings/services/settings.service'

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: settingsService.get,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all })
      toast.success('Configurações salvas!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao salvar configurações')
    },
  })
}
