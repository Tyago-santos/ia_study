import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/shared/store/auth'
import { authService } from '@/features/auth/services/auth.service'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user)
      toast.success('Login realizado com sucesso!')
      navigate({ to: '/dashboard' })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao fazer login')
    },
  })
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.user)
      toast.success('Conta criada com sucesso!')
      navigate({ to: '/dashboard' })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar conta')
    },
  })
}
