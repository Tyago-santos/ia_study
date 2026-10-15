import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { aiService } from '@/features/ai/services/ai.service'

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.ai.conversations(),
    queryFn: aiService.getConversations,
  })
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.ai.messages(conversationId),
    queryFn: () => aiService.getMessages(conversationId),
    enabled: !!conversationId && conversationId.length > 0,
  })
}

export function useCreateConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: aiService.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.conversations() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar conversa')
    },
  })
}

export function useRenameConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { id: string; title: string }) =>
      aiService.renameConversation(input.id, input.title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.conversations() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao renomear conversa')
    },
  })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => aiService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.conversations() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao apagar conversa')
    },
  })
}

/**
 * Apaga todas as mensagens de uma conversa sem remove-la da lista — o caminho
 * para "limpar o chat" sem perder a conversa em si. Invalida as mensagens da
 * conversa e a lista (o titulo/updatedAt podem mudar no servidor).
 */
export function useClearMessages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) => aiService.clearMessages(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.messages(conversationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.conversations() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao limpar a conversa')
    },
  })
}

/**
 * Nao amarra o `conversationId` no momento em que o hook e' montado: a
 * conversa ativa pode nascer (criacao preguicosa da primeira pergunta) entre
 * a montagem e o envio, e um `conversationId` capturado cedo demais mandaria
 * a mensagem pra conversa errada (ou pra nenhuma).
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      aiService.sendMessage(conversationId, { content }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.messages(variables.conversationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.conversations() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar mensagem')
    },
  })
}
