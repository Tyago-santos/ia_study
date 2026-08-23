import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { useAuthStore } from '@/shared/store/auth'
import { profileService } from '@/features/profile/services/profile.service'

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: profileService.getProfile,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
      setUser(data)
      toast.success('Perfil atualizado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar perfil')
    },
  })
}
