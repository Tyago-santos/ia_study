import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, Eraser, MessageSquareText, Sparkles, Tag } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ConfirmDialog, ErrorState } from '@/shared/components/ui'
import { useChatSession } from '@/features/ai/hooks/useChatSession'
import { QUICK_PROMPTS } from '@/features/ai/lib/quickPrompts'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { ChatComposer } from '../components/ChatComposer'
import { ConversationsPanel } from '../components/ConversationsPanel'
import { ChatWelcome } from '../components/ChatWelcome'

/** Tons dos icones dos chips rapidos: cyan, violeta e indigo alternados (Stitch). */
const CHIP_ICON_TONES = [
  'text-tertiary-400',
  'text-[var(--secondary-accent)]',
  'text-[var(--accent-text)]',
] as const

export function AIPage() {
  const chat = useChatSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sessionsOpen, setSessionsOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages, chat.pendingText])

  if (chat.conversationsError) {
    return <ErrorState message="Erro ao carregar conversas" onRetry={chat.refetch} />
  }

  const hasMessages = (chat.messages && chat.messages.length > 0) || !!chat.pendingText
  const activeTitle =
    chat.conversations.find((c) => c.id === chat.activeConversation)?.title ?? null
  /** Mesma condicao do composer: sem conversa ativa ou com envio em andamento. */
  const sendDisabled = !chat.activeConversation || chat.isSending

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      <div className="shrink-0 border-b border-[var(--border)]">
        {/* Cabeçalho do conversador: avatar do tutor, nome, status online e pills */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-[var(--bg-secondary)]">
          <div className="relative shrink-0">
            <div className="flex w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 via-secondary-500 to-tertiary-500 items-center justify-center shadow-[0_0_16px_rgba(79,70,229,0.35)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-tertiary-400 ring-2 ring-[var(--bg-secondary)] shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-[var(--text)] truncate">Gnosis IA</h1>
              <BadgeCheck className="w-4 h-4 shrink-0 text-[var(--accent-text)]" />
            </div>
            <p className="text-xs truncate">
              <span className="font-bold text-[var(--tertiary-accent)]">Online</span>
              <span className="text-[var(--text-secondary)]">
                {' '}
                • Tire dúvidas, peça resumos e planos personalizados
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Pill de contexto: o tema da conversa ativa */}
            {activeTitle && (
              <span
                className="flex items-center gap-1.5 min-w-0 max-w-[110px] sm:max-w-[220px] rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 shadow-sm"
                title={activeTitle}
              >
                <Tag className="w-3.5 h-3.5 shrink-0 text-[var(--secondary-accent)]" />
                <span className="text-[11px] font-bold text-[var(--text)] truncate">
                  {activeTitle}
                </span>
              </span>
            )}
            {hasMessages ? (
              <button
                onClick={() => setClearOpen(true)}
                disabled={chat.isClearing}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] hover:border-[var(--danger)]/40 disabled:opacity-50 transition-colors"
                title="Limpar conversa"
              >
                <Eraser className="w-[18px] h-[18px]" />
              </button>
            ) : null}
            <button
              onClick={() => setSessionsOpen(true)}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)] hover:border-primary-500/50 transition-colors"
              title="Conversas"
            >
              <MessageSquareText className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Chips de ações rápidas logo abaixo do cabeçalho */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 sm:px-6 py-3 bg-[var(--sidebar-bg)] select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {QUICK_PROMPTS.map(({ icon: Icon, title, prompt }, index) => (
            <button
              key={title}
              onClick={() => chat.send(prompt)}
              disabled={sendDisabled}
              title={title}
              className="shrink-0 flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition-all hover:border-primary-500/50 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                className={cn('w-4 h-4', CHIP_ICON_TONES[index % CHIP_ICON_TONES.length])}
              />
              <span>{title}</span>
            </button>
          ))}
        </div>
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

        <ChatComposer disabled={sendDisabled} onSend={chat.send} />
      </div>

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={() => {
          chat.clearConversationMessages()
          setClearOpen(false)
        }}
        title="Limpar conversa"
        description="Todas as mensagens desta conversa serão apagadas. A conversa continua na lista, mas o histórico não pode ser recuperado."
        confirmLabel="Limpar"
        isPending={chat.isClearing}
      />
    </div>
  )
}
