import { useEffect, useRef, useState } from 'react'
import { MessageSquareText, Sparkles } from 'lucide-react'
import { ErrorState } from '@/shared/components/ui'
import { useChatSession } from '@/features/ai/hooks/useChatSession'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { ChatComposer } from '../components/ChatComposer'
import { ConversationsPanel } from '../components/ConversationsPanel'
import { ChatWelcome } from '../components/ChatWelcome'

export function AIPage() {
  const chat = useChatSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sessionsOpen, setSessionsOpen] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages, chat.pendingText])

  if (chat.conversationsError) {
    return <ErrorState message="Erro ao carregar conversas" onRetry={chat.refetch} />
  }

  const hasMessages = (chat.messages && chat.messages.length > 0) || !!chat.pendingText

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 items-center justify-center shadow-md shadow-primary-500/25">
          <Sparkles className="w-[18px] h-[18px] text-[var(--on-accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-[var(--text)] truncate">
            {chat.conversations.find((c) => c.id === chat.activeConversation)?.title ??
              'Assistente de Estudos'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Tire dúvidas, peça resumos e planos personalizados
          </p>
        </div>
        <button
          onClick={() => setSessionsOpen(true)}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]"
          title="Conversas"
        >
          <MessageSquareText className="w-[18px] h-[18px]" />
        </button>
      </div>

      <ConversationsPanel
        open={sessionsOpen}
        onClose={() => setSessionsOpen(false)}
        conversations={chat.conversations}
        activeId={chat.activeConversation}
        onSelect={chat.switchConversation}
        onNew={chat.newChat}
        onRename={chat.renameConversation}
        onDelete={chat.deleteConversation}
      />

      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0 overflow-y-auto px-4 sm:px-6 pt-6 pb-32">
          <div className="max-w-3xl mx-auto space-y-4">
            {chat.messagesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className="w-2/3 h-16 bg-[var(--bg-secondary)] rounded-2xl animate-pulse" />
                  </div>
                ))}
              </div>
            ) : hasMessages ? (
              <>
                {chat.messages?.map((message) => (
                  <ChatBubble
                    key={message.id}
                    content={message.content}
                    role={message.role}
                    createdAt={message.createdAt}
                  />
                ))}

                {chat.pendingText && (
                  <>
                    <ChatBubble content={chat.pendingText} role="user" pending />
                    <TypingIndicator />
                  </>
                )}

                <div ref={messagesEndRef} />
              </>
            ) : chat.activeConversation ? (
              <ChatWelcome onSelectPrompt={chat.send} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <ChatComposer disabled={!chat.activeConversation || chat.isSending} onSend={chat.send} />
      </div>
    </div>
  )
}
