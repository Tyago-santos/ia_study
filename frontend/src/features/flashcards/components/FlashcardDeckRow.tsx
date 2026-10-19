import { ArrowRight, Check } from 'lucide-react'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import type { Flashcard, Subject } from '@/shared/types'
import {
  deckDominionPct,
  dueTodayCount,
  nextReviewLabel,
} from '@/features/flashcards/lib/progress'

interface FlashcardDeckRowProps {
  subject?: Subject
  cards: Flashcard[]
  /** Inicia a sessao de revisao (mesmo handler da pagina; a sessao cobre todos os cards). */
  onReview: () => void
}

/**
 * Linha de deck da lista "Seus Decks de Estudo": miniatura, badge de materia
 * (pill tintado colorido), contagem de cards, barra de dominio em gradiente,
 * status de pendentes e botao circular de revisao.
 */
export function FlashcardDeckRow({ subject, cards, onReview }: FlashcardDeckRowProps) {
  const SubjectIcon = getSubjectIcon(subject?.icon)
  const pending = dueTodayCount(cards)
  const dominion = deckDominionPct(cards)
  const next = nextReviewLabel(cards)
  const color = subject?.color

  const tint = color
    ? { backgroundColor: `${color}26`, color }
    : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }
  const tintSoft = color
    ? { backgroundColor: `${color}18`, borderColor: `${color}40`, color }
    : {
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
        color: 'var(--text-secondary)',
      }

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-[var(--glass-shadow)] backdrop-blur-sm transition-all duration-200 hover:shadow-lg sm:p-5">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
          style={tintSoft}
        >
          <SubjectIcon className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide" style={tint}>
              {subject?.name ?? 'Sem matéria'}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">{cards.length} cards</span>
          </div>
          <h3 className="mt-1 truncate text-base font-bold text-[var(--text)]">
            {subject?.name ?? 'Sem matéria'}
          </h3>
        </div>

        <div className="shrink-0 text-right">
          {pending > 0 ? (
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {pending} pendentes
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-tertiary-400/15 px-2.5 py-1 text-[11px] font-bold text-tertiary-400">
              Em dia!
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-tertiary-400 transition-all duration-500"
          style={{ width: `${dominion}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-secondary)]">
          Domínio:{' '}
          <span className="font-semibold text-[var(--text)]">{dominion}%</span>
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-secondary)]">Próx: {next}</span>
          <button
            type="button"
            onClick={onReview}
            aria-label="Iniciar revisão de flashcards"
            title="Revisar flashcards"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-primary-500/40 hover:bg-primary-500/15 hover:text-[var(--accent-text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            {pending > 0 ? <ArrowRight className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </article>
  )
}
