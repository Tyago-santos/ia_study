import type { User } from '@/shared/types'
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema'

export interface AuthSession {
  user: User
  token: string
}

/**
 * Regra de autenticacao da feature.
 *
 * O backend ainda nao expoe /auth, entao a sessao e montada localmente. Quando
 * a API entrar, so o corpo destas funcoes muda: hooks e telas ja consomem
 * `AuthSession` e nao sabem de onde ela vem.
 */
export const authService = {
  async login(data: LoginFormData): Promise<AuthSession> {
    return {
      user: {
        id: 'mock-user-id',
        // Sem perfil vindo do servidor, o trecho antes do @ e o melhor nome
        // disponivel para saudar o usuario ja na primeira tela.
        name: data.email.split('@')[0],
        email: data.email,
      },
      token: 'mock-token',
    }
  },

  async register(data: RegisterFormData): Promise<AuthSession> {
    return {
      user: {
        id: 'mock-user-id',
        name: data.name,
        email: data.email,
      },
      token: 'mock-token',
    }
  },
}
