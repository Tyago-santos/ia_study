import { api } from '@/shared/services/api'
import type { User } from '@/shared/types'

interface AuthResponse {
  user: User
  // O backend ainda manda um token no corpo (o app mobile usa, via
  // Authorization: Bearer) — o web ignora, a sessao dele vive no cookie
  // httpOnly que o backend seta na mesma resposta.
  token: string
}

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  logout: () => api.post<void>('/auth/logout'),
}
