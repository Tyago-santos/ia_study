import type { Flashcard } from '@/shared/types'

/**
 * Estatisticas de apresentacao da tela de flashcards (design "Cognitive Flow").
 * Tudo aqui e derivado de campos que ja existem no Flashcard (nextReview,
 * reviewCount, difficulty) — nada e persistido nem usado pela logica de revisao;
 * serve apenas para preencher os cards de progresso, as barras de dominio e os
 * status "pendentes" da lista de decks.
 */

/** ~20s por card revisado — base do estimulo "~N min de foco". */
const MS_PER_CARD = 20_000

/** Peso da ultima autoavaliacao (escala 0..1 usada pelos estimadores). */
const STRENGTH: Record<Flashcard['difficulty'], number> = {
  easy: 1,
  medium: 0.75,
  hard: 0.45,
}

/** Timestamp da proxima revisao; data invalida/ausente conta como pendente. */
function reviewTs(card: Flashcard): number {
  const value = new Date(card.nextReview).getTime()
  return Number.isNaN(value) ? 0 : value
}

function endOfToday(now: Date): number {
  const limit = new Date(now)
  limit.setHours(23, 59, 59, 999)
  return limit.getTime()
}

/** Cards que vencem hoje (ou estao atrasados) — a "meta de hoje". */
export function dueTodayCount(cards: Flashcard[], now = new Date()): number {
  const limit = endOfToday(now)
  return cards.filter((card) => reviewTs(card) <= limit).length
}

/** Revisoes ja agendadas para os proximos 7 dias. */
export function upcomingWeekCount(cards: Flashcard[], now = new Date()): number {
  const from = now.getTime()
  const to = from + 7 * 24 * 60 * 60 * 1000
  return cards.filter((card) => {
    const ts = reviewTs(card)
    return ts > from && ts <= to
  }).length
}

/** Estimativa de minutos de foco para fechar a meta de hoje. */
export function estimateFocusMinutes(dueCount: number): number {
  if (dueCount <= 0) return 0
  return Math.max(1, Math.round((dueCount * MS_PER_CARD) / 60_000))
}

/**
 * Retencao estimada (0-100): media do peso da ultima autoavaliacao entre os
 * cards ja revisados — quem nunca revisou ainda nao tem retencao registrada.
 */
export function retentionPct(cards: Flashcard[]): number {
  const reviewed = cards.filter((card) => card.reviewCount > 0)
  if (reviewed.length === 0) return 0
  const total = reviewed.reduce((sum, card) => sum + STRENGTH[card.difficulty], 0)
  return Math.round((total / reviewed.length) * 100)
}

/**
 * Dominio estimado de um deck (0-100): peso da ultima autoavaliacao
 * proporcional as revisoes feitas (teto de 4 revisoes por card).
 */
export function deckDominionPct(cards: Flashcard[]): number {
  if (cards.length === 0) return 0
  const total = cards.reduce((sum, card) => {
    const reviews = Math.min(card.reviewCount, 4) / 4
    return sum + STRENGTH[card.difficulty] * reviews
  }, 0)
  return Math.round((total / cards.length) * 100)
}

/** Proxima revisao do deck: "hoje", "amanhã" ou dd/mm. */
export function nextReviewLabel(cards: Flashcard[], now = new Date()): string {
  if (cards.length === 0) return '—'
  const next = Math.min(...cards.map(reviewTs))
  const today = endOfToday(now)
  if (next <= today) return 'hoje'
  if (next <= today + 24 * 60 * 60 * 1000) return 'amanhã'
  return new Date(next).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
