import { api } from '@/shared/services/api'
import { useAuthStore } from '@/shared/store/auth'
import type { User } from '@/shared/types'

/**
 * `bio`/`avatar` nao existem no model `User` do backend (so' name/email/senha) —
 * ficam so' no estado local ate o backend ganhar essas colunas.
 */
export const profileService = {
  getProfile: async () => {
    const { user } = await api.get<{ user: User }>('/users/me')
    return user
  },

  updateProfile: async (data: { name?: string; bio?: string; avatar?: string }) => {
    const current = useAuthStore.getState().user
    if (!current) throw new Error('Usuário não autenticado')

    const { name, bio, avatar } = data
    // `bio`/`avatar` nao tem coluna no backend: so' manda o PATCH quando ha'
    // campo de verdade pra atualizar (o backend rejeita corpo vazio).
    const user = name ? (await api.patch<{ user: User }>(`/users/${current.id}`, { name })).user : current

    return { ...user, ...(bio !== undefined ? { bio } : {}), ...(avatar !== undefined ? { avatar } : {}) }
  },
}
