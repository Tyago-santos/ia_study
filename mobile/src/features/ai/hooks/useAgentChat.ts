import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import {
  GeminiCancelledError,
  GeminiError,
  isGeminiConfigured,
} from '@/features/ai/libs/gemini/gemini.client'
import { MAX_HISTORY_TURNS } from '@/features/ai/schemas/ai.schema'
import { runAgent } from '@/features/ai/services/agent.service'
import type { ChatTurn } from '@/features/ai/types/ai.types'
import { queryKeys } from '@/shared/constants/queryKeys'
import { aiService } from '@/shared/services/dataStore'
import type { ChatMessage } from '@/shared/types'

/**
 * Estado e orquestracao do chat.
 *
 * A conversa vive no banco local (o react-query so' le' de la'), entao a ordem e'
 * sempre: grava a pergunta, chama o agente, grava a resposta. Se o modelo
 * falhar, a pergunta ja esta salva e o erro aparece como aviso, sem virar uma
 * mensagem falsa do assistente.
 */

const CONNECTION_ERROR = 'Nao consegui responder agora. Tente novamente em instantes.'

/** Reduz o historico ao que o modelo precisa e corta os turnos mais antigos. */
function toHistory(messages: ChatMessage[]): ChatTurn[] {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content }))
}

export function useAgentChat() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const { data: conversations } = useQuery({
    queryKey: queryKeys.ai.conversations(),
    queryFn: aiService.listConversations,
  })
  const { data: configured = true } = useQuery({
    queryKey: queryKeys.ai.status(),
    queryFn: isGeminiConfigured,
    staleTime: 5 * 60 * 1000,
  })

  const conversationId = conversations?.[0]?.id ?? null

  const { data: messages } = useQuery({
    queryKey: queryKeys.ai.messages(conversationId ?? ''),
    queryFn: () => aiService.listMessages(conversationId!),
    enabled: !!conversationId,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.ai.all })

  const ask = useMutation({
    mutationFn: async ({ content, webSearch }: { content: string; webSearch: boolean }) => {
      const question = content.trim()
      if (!question) return

      // O app comeca sem nenhuma conversa gravada: a primeira pergunta abre uma.
      const id = conversationId ?? (await aiService.createConversation()).id
      const history = toHistory(messages ?? [])

      await aiService.addMessage({ conversationId: id, content: question, role: 'user' })
      await invalidate()

      const controller = new AbortController()
      controllerRef.current = controller

      const answer = await runAgent({ message: question, history, webSearch }, controller.signal)
      await aiService.addMessage({ conversationId: id, content: answer, role: 'assistant' })
      // Sem isto, o loading some (isPending vira false) antes do refetch das
      // mensagens terminar: a resposta pisca na tela em vez de aparecer junto.
      await invalidate()
    },
    onMutate: () => setError(null),
    onError: (cause) => {
      // Cancelamento foi o usuario que pediu: a pergunta fica salva, sem virar aviso de erro.
      if (cause instanceof GeminiCancelledError) return
      setError(cause instanceof GeminiError ? cause.message : CONNECTION_ERROR)
    },
    onSettled: () => {
      controllerRef.current = null
      invalidate()
    },
  })

  const clear = useMutation({
    mutationFn: async () => {
      if (!conversationId) return
      await aiService.clearMessages(conversationId)
    },
    onSettled: invalidate,
  })

  return {
    messages: messages ?? [],
    isEmpty: (messages?.length ?? 0) === 0,
    loading: ask.isPending,
    error,
    isConfigured: configured,
    submit: (content: string, webSearch = false) => {
      if (!content.trim() || ask.isPending) return
      ask.mutate({ content, webSearch })
    },
    clearChat: clear.mutate,
    clearing: clear.isPending,
    dismissError: () => setError(null),
    cancel: () => controllerRef.current?.abort(),
  }
}
