import { Sparkles } from 'lucide-react'
import { QUICK_PROMPTS } from '@/features/ai/lib/quickPrompts'

interface ChatWelcomeProps {
  onSelectPrompt: (prompt: string) => void
}

export function ChatWelcome({ onSelectPrompt }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Cartao de boas-vindas no padrao de card do spec */}
      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--glass-shadow)] p-5">
        <div className="flex w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white items-center justify-center shrink-0 mt-0.5 shadow-md shadow-primary-500/30">
          <Sparkles className="w-[18px] h-[18px]" />
        </div>
        <div>
          <p className="text-sm text-[var(--text)] leading-relaxed">
            Olá! Sou seu assistente de estudos. Posso te ajudar com:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--text)]">
            <li className="flex gap-1.5">
              <span className="text-[var(--accent-text)]">•</span>
              <span>
                <strong className="font-bold text-[var(--accent-text)]">Explicações</strong> de
                conceitos difíceis
              </span>
            </li>
            <li className="flex gap-1.5">
              <span className="text-[var(--accent-text)]">•</span>
              <span>
                <strong className="font-bold text-[var(--accent-text)]">Resumos</strong> e revisões
                de conteúdo
              </span>
            </li>
            <li className="flex gap-1.5">
              <span className="text-[var(--accent-text)]">•</span>
              <span>
                <strong className="font-bold text-[var(--accent-text)]">Planos de estudo</strong>{' '}
                personalizados
              </span>
            </li>
            <li className="flex gap-1.5">
              <span className="text-[var(--accent-text)]">•</span>
              <span>
                Tirar <strong className="font-bold text-[var(--accent-text)]">dúvidas</strong> sobre
                qualquer matéria
              </span>
            </li>
          </ul>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Escolha um atalho abaixo ou faça sua pergunta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK_PROMPTS.map(({ icon: Icon, title, description, prompt }) => (
          <button
            key={title}
            onClick={() => onSelectPrompt(prompt)}
            className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--glass-shadow)] hover:border-primary-500/50 hover:-translate-y-0.5 hover:shadow-lg transition-all text-left"
          >
            <div className="flex w-9 h-9 rounded-xl bg-primary-500/15 text-[var(--accent-text)] items-center justify-center shrink-0">
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
