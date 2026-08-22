import { api } from '@/shared/services/api'
import type { User } from '@/shared/types'
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema'

export interface AuthSession {
  user: User
  token: string
}

/** Regra de autenticacao da feature — fala com /auth/login e /auth/register no backend. */
export const authService = {
  async login(data: LoginFormData): Promise<AuthSession> {
    return api.post<AuthSession>('/auth/login', data)
  },

  async register(data: RegisterFormData): Promise<AuthSession> {
    // confirmPassword e' so' validacao do formulario; o backend nao conhece esse campo.
    const { confirmPassword: _confirmPassword, ...payload } = data
    return api.post<AuthSession>('/auth/register', payload)
  },
}
