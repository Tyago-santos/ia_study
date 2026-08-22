import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/shared/types'
import { secureStorage } from '@/shared/services/secureStorage'

interface AuthState {
  user: User | null
  token: string | null
  hasHydrated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,

      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'studyhub-auth',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true })
      },
    },
  ),
)
