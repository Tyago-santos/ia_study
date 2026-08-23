import { create } from 'zustand'
import type { Theme } from '@/shared/types'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('studyhub-theme') as Theme) || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('studyhub-theme', theme)
    set({ theme })
  },
}))
