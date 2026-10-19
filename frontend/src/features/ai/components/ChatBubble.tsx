import { Sparkles } from 'lucide-react'
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

  /* Usuario: bolha em gradiente de marca, canto superior direito "cortado"
     (assimetrico como no Stitch) e horario solto abaixo, alinhado a direita. */
  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="flex flex-col items-end gap-1 max-w-[85%] sm:max-w-[70%]">
          <div
            className={cn(
              'px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap text-white bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl rounded-tr-none shadow-md',
              pending && 'opacity-70'
            )}
          >
            {content}
          </div>
          {createdAt && (
            <span className="pr-1 text-[10px] text-[var(--text-secondary)]">
              {formatMessageTime(createdAt)}
            </span>
          )}
        </div>
      </div>
    )
  }

  /* IA: linha de autoria (avatar violeta, nome e hora em cyan) + card de
     resposta com borda fina, como o "Tutor IA 14:33" da referencia. */
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex flex-col items-start gap-1.5 max-w-[96%]">
        <div className="flex items-center gap-2 pl-1">
          <span className="flex w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
          <span className="text-[11px] font-bold text-[var(--text-secondary)]">Tutor IA</span>
          {createdAt && (
            <span className="text-[11px] font-bold text-[var(--tertiary-accent)]">
              {formatMessageTime(createdAt)}
            </span>
          )}
        </div>
        <div
          className={cn(
            'w-full px-4 py-3 rounded-2xl rounded-tl-none border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--glass-shadow)]',
            pending && 'opacity-70'
          )}
        >
          {/* IA: renderiza markdown formatado. break-words: URL/token longo
              estourava a bolha e era cortado pelo shell */}
          <MarkdownContent content={content} className="text-sm leading-relaxed" />
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--glass-shadow)] px-4 py-3">
        <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
        <span className="text-xs text-[var(--text-secondary)]">Tutor IA formulando resposta...</span>
      </div>
    </div>
  )
}
