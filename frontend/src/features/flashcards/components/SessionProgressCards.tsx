import { CalendarDays, Zap } from 'lucide-react'
import type { Flashcard } from '@/shared/types'
import {
  dueTodayCount,
  estimateFocusMinutes,
  retentionPct,
  upcomingWeekCount,
} from '@/features/flashcards/lib/progress'

interface SessionProgressCardsProps {
  cards: Flashcard[]
}

/** Raio/circunferencia do anel de retencao (viewBox 100x100). */
const RING_RADIUS = 40
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/**
 * Card de progresso da sessao (meta do dia, conclusao e retencao) no padrao
 * do spec "Cognitive Flow": superficie do card + barra em gradiente indigo→cyan.
 */
export function SessionProgressCards({ cards }: SessionProgressCardsProps) {
  const total = cards.length
  const due = dueTodayCount(cards)
  const done = total - due
  const donePct = total > 0 ? Math.round((done / total) * 100) : 0
  const retention = retentionPct(cards)
  const upcoming = upcomingWeekCount(cards)
  const focusMinutes = estimateFocusMinutes(due)
  const dashOffset = RING_CIRCUMFERENCE * (1 - retention / 100)

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[var(--glass-shadow)] backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)]">Meta de Hoje</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[var(--accent-text)]">
                {due}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">cards</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-tertiary-400">
              <Zap className="w-3.5 h-3.5" />~{focusMinutes} min de foco
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[var(--text-secondary)]">Concluídos hoje</span>
              <span className="font-semibold text-[var(--text)]">
                {done} / {total} ({donePct}%)
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-tertiary-400 transition-all duration-500"
                style={{ width: `${donePct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <div
            className="relative h-24 w-24"
            title="Estimativa pela última autoavaliação de dificuldade"
          >
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="flashcards-retention-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'var(--color-primary-500)' }} />
                  <stop offset="100%" style={{ stopColor: 'var(--color-tertiary-400)' }} />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="9"
                className="stroke-[var(--bg-secondary)]"
              />
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                stroke="url(#flashcards-retention-ring)"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-[var(--text)]">{retention}%</span>
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">Retenção</span>
            </div>
          </div>
          <p className="flex items-center gap-1 text-[11px] font-semibold text-tertiary-400">
            <CalendarDays className="w-3.5 h-3.5" />
            {upcoming} revisões em 7 dias
          </p>
        </div>
      </div>
    </section>
  )
}
