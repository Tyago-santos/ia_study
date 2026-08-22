import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useAuthStore } from '@/shared/store/auth'
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema'
import { authService, type AuthSession } from '../services/auth.service'

/** Persiste a sessao e manda para o app; o destino e o mesmo nos dois fluxos. */
function useStartSession() {
  const login = useAuthStore((s) => s.login)

  return (session: AuthSession) => {
    login(session.user, session.token)
    router.replace('/(app)/dashboard')
  }
}

export function useLogin() {
  const startSession = useStartSession()

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: startSession,
  })
}

export function useRegister() {
  const startSession = useStartSession()

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: startSession,
  })
}
