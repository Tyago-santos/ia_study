import { create } from 'zustand'
import { setUnauthorizedHandler } from '@/shared/services/api'
import { authService } from '@/features/auth/services/auth.service'
import { profileService } from '@/features/profile/services/profile.service'
import type { User } from '@/shared/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  setUser: (user: User) => void
  /** Confere a sessao (cookie httpOnly) com o backend — usado no boot do app e nas rotas protegidas. */
  checkAuth: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    try {
      await authService.logout()
    } finally {
      set({ user: null, isAuthenticated: false })
    }
  },

  setUser: (user) => set({ user }),

  checkAuth: async () => {
    try {
      const user = await profileService.getProfile()
      set({ user, isAuthenticated: true })
      return true
    } catch {
      set({ user: null, isAuthenticated: false })
      return false
    }
  },
}))

// Sessao caiu no meio do uso (cookie expirou/foi revogado): limpa o estado
// local pra tela nao continuar achando que o usuario esta logado.
setUnauthorizedHandler(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false })
})
