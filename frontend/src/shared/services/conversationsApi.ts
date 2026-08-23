import { api } from '@/shared/services/api'
import type { ChatMessage, Conversation } from '@/shared/types'

/** Conversas do chat de IA no backend — cada uma com seu proprio historico. */

export interface RemoteConversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface RemoteChatMessage {
  id: string
  role: ChatMessage['role']
  content: string
  createdAt: string
}

export function toConversation(remote: RemoteConversation): Conversation {
  return { ...remote, messages: [] }
}

export function toChatMessage(remote: RemoteChatMessage): ChatMessage {
  return { id: remote.id, role: remote.role, content: remote.content, createdAt: remote.createdAt }
}

export const conversationsApi = {
  list: () => api.get<RemoteConversation[]>('/conversations'),

  create: (title?: string) =>
    api.post<RemoteConversation>('/conversations', title ? { title } : {}),

  rename: (id: string, title: string) =>
    api.patch<RemoteConversation>(`/conversations/${id}`, { title }),

  remove: async (id: string) => {
    await api.delete(`/conversations/${id}`)
    return id
  },

  listMessages: (id: string) => api.get<RemoteChatMessage[]>(`/conversations/${id}/messages`),

  addMessage: (id: string, input: { role: ChatMessage['role']; content: string }) =>
    api.post<RemoteChatMessage>(`/conversations/${id}/messages`, input),

  clearMessages: (id: string) => api.delete(`/conversations/${id}/messages`),
}
