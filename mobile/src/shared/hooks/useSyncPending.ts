import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { queryKeys } from '@/shared/constants/queryKeys'
import { flashcardsApi } from '@/shared/services/flashcardsApi'
import { subjectsApi, topicsApi } from '@/shared/services/libraryApi'
import { type SyncHandlers, drainQueue } from '@/shared/services/offlineFirst'
import { quizzesApi } from '@/shared/services/quizzesApi'
import { useAuthStore } from '@/shared/store/auth'

/**
 * Reenvia ao servidor o que foi criado/alterado enquanto ele estava fora.
 *
 * Roda ao abrir o app e toda vez que ele volta do segundo plano — os dois
 * momentos em que a rede pode ter voltado desde a ultima tentativa.
 */

const HANDLERS: SyncHandlers = {
  subjects: {
    create: (payload) => subjectsApi.create(payload),
    remove: (id) => subjectsApi.remove(id),
  },
  topics: {
    create: (payload) => topicsApi.create(payload),
    toggle: (id) => topicsApi.toggle(id),
    remove: (id) => topicsApi.remove(id),
  },
  flashcards: {
    create: (payload) => flashcardsApi.create(payload),
    remove: (id) => flashcardsApi.remove(id),
  },
  quizzes: {
    create: (payload) => quizzesApi.create(payload),
    submit: (payload) => quizzesApi.submit(payload),
    remove: (id) => quizzesApi.remove(id),
  },
}

export function useSyncPending() {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    // Sem sessao nao ha' o que sincronizar: as rotas exigem token.
    if (!token) return

    const sync = async () => {
      const synced = await drainQueue(HANDLERS).catch(() => 0)
      // So' invalida se algo mudou de fato — refetch a cada foco seria
      // desperdicio de rede num app que abre e fecha o tempo todo.
      if (synced > 0) await queryClient.invalidateQueries()
    }

    sync()

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync()
    })

    return () => subscription.remove()
  }, [token, queryClient])
}
