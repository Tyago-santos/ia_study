import { create } from 'zustand'

export type NotificationKind = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  id: string
  title: string
  message?: string
  kind: NotificationKind
  /** Milissegundos ate sumir sozinha; 0 exige fechar no toque. */
  duration: number
  createdAt: number
}

interface NotificationState {
  items: AppNotification[]
  push: (input: {
    title: string
    message?: string
    kind?: NotificationKind
    duration?: number
  }) => string
  dismiss: (id: string) => void
  clear: () => void
}

let counter = 0

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],

  push: ({ title, message, kind = 'info', duration = 4000 }) => {
    const id = `n${++counter}`

    set((state) => ({
      // Mais de tres banners empilhados cobrem a tela inteira, entao os antigos
      // saem para dar lugar aos novos.
      items: [...state.items.slice(-2), { id, title, message, kind, duration, createdAt: Date.now() }],
    }))

    return id
  },

  dismiss: (id) => set((state) => ({ items: state.items.filter((n) => n.id !== id) })),

  clear: () => set({ items: [] }),
}))

/**
 * Atalho para disparar de fora de componentes (services, timers), onde nao ha
 * hook disponivel.
 */
export const notify = (input: {
  title: string
  message?: string
  kind?: NotificationKind
  duration?: number
}) => useNotificationStore.getState().push(input)
