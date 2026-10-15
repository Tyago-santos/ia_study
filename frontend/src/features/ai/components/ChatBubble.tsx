import { Bot, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { formatMessageTime } from '@/features/ai/lib/quickPrompts'
import { MarkdownContent } from './MarkdownContent'

interface ChatBubbleProps {
  content: string
  role: 'user' | 'assistant'
  createdAt?: string
  pending?: boolean
}

export function ChatBubble({ content, role, createdAt, pending }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div
      className={cn('flex items-end gap-2 animate-fade-in', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex w-7 h-7 rounded-full bg-primary-500/15 text-[var(--accent-text)] items-center justify-center shrink-0">
          <Bot className="w-4 h-4" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] sm:max-w-[70%] px-4 py-2.5 shadow-sm',
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-[var(--on-accent)] rounded-2xl rounded-br-sm'
            : 'bg-[var(--bg-secondary)] text-[var(--text)] rounded-2xl rounded-bl-sm',
          pending && 'opacity-70'
        )}
      >
        {/* IA: renderiza markdown formatado; usuário: texto puro como digitou.
            break-words: URL/token longo estourava a bolha e era cortado pelo shell */}
        {isUser ? (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{content}</p>
        ) : (
          <MarkdownContent content={content} className="text-sm leading-relaxed" />
        )}
        {createdAt && (
          <span
            className={cn(
              'block mt-1 text-[10px]',
              isUser ? 'text-[var(--on-accent)] opacity-70' : 'text-[var(--text-secondary)]'
            )}
          >
            {formatMessageTime(createdAt)}
          </span>
        )}
      </div>
      {isUser && (
        <div className="flex w-7 h-7 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start animate-fade-in">
      <div className="flex w-7 h-7 rounded-full bg-primary-500/15 text-[var(--accent-text)] items-center justify-center shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-[var(--bg-secondary)] rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" />
      </div>
    </div>
  )
}
