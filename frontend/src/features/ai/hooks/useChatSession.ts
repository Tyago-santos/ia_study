import { useEffect, useRef, useState } from 'react'
import {
  useClearMessages,
  useConversations,
  useCreateConversation,
  useDeleteConversation,
  useMessages,
  useRenameConversation,
  useSendMessage,
} from '@/features/ai/hooks/useAI'

/**
 * Owns the chat lifecycle: picks (or creates) the active conversation,
 * loads its messages and tracks the optimistic "pending" message while
 * the assistant reply is in flight. Also owns switching between sessions.
 *
 * `activeId` has three states: `undefined` (nothing chosen yet — falls back
 * to the most recent conversation), `null` (an explicit "new chat" draft,
 * created lazily on the first message) and a real id (a chosen session).
 */
export function useChatSession() {
  const [activeId, setActiveId] = useState<string | null | undefined>(undefined)
  const [pendingText, setPendingText] = useState<string | null>(null)
  const hasRequestedCreateRef = useRef(false)

  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch,
  } = useConversations()

  const activeConversation = activeId === undefined ? (conversations?.[0]?.id ?? null) : activeId

  const {
    data: messages,
    isLoading: messagesLoading,
    isFetching: messagesFetching,
  } = useMessages(activeConversation ?? '')
  const createConversation = useCreateConversation()
  const renameConversation = useRenameConversation()
  const deleteConversation = useDeleteConversation()
  const clearMessages = useClearMessages()
  const sendMessage = useSendMessage()

  useEffect(() => {
    if (conversationsLoading || activeId !== undefined) return
    if (conversations && conversations.length === 0 && !hasRequestedCreateRef.current) {
      hasRequestedCreateRef.current = true
      createConversation.mutate(undefined, {
        onSuccess: (conversation) => setActiveId(conversation.id),
      })
    }
  }, [conversations, activeId, conversationsLoading, createConversation])

  useEffect(() => {
    if (pendingText && !sendMessage.isPending && !messagesFetching) {
      setPendingText(null)
    }
  }, [pendingText, sendMessage.isPending, messagesFetching])

  const send = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || sendMessage.isPending) return
    setPendingText(trimmed)

    // Rascunho de "nova conversa" ainda sem id: a primeira pergunta cria a
    // conversa de verdade antes de mandar a mensagem.
    let id = activeConversation
    if (!id) {
      const conversation = await createConversation.mutateAsync(undefined)
      id = conversation.id
      setActiveId(id)
    }

    sendMessage.mutate({ conversationId: id, content: trimmed })
  }

  return {
    conversations: conversations ?? [],
    activeConversation,
    messages,
    messagesLoading,
    pendingText,
    isSending: sendMessage.isPending,
    conversationsError,
    refetch,
    send,
    switchConversation: (id: string) => setActiveId(id),
    newChat: () => setActiveId(null),
    renameConversation: renameConversation.mutate,
    /** Apaga as mensagens da conversa ativa, mantendo-a na lista. */
    clearConversationMessages: () => {
      if (!activeConversation) return
      clearMessages.mutate(activeConversation, {
        onSuccess: () => setPendingText(null),
      })
    },
    isClearing: clearMessages.isPending,
    deleteConversation: (id: string) => {
      deleteConversation.mutate(id, {
        onSuccess: () => {
          // Apagou a ativa: volta a escolher a mais recente que sobrar.
          if (id === activeConversation) setActiveId(undefined)
        },
      })
    },
  }
}
