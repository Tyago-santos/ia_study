import { Layers, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { useFlashcards } from '@/features/flashcards/hooks/useFlashcards'
import { SessionProgressCards } from './SessionProgressCards'

interface FlashcardsHeaderProps {
  total: number
  onCreate: () => void
  onReview: () => void
}

export function FlashcardsHeader({ total, onCreate, onReview }: FlashcardsHeaderProps) {
  // Mesma queryKey da pagina (cache compartilhado, sem nova requisicao): base
  // dos cards de progresso, sem precisar alterar as props da pagina.
  const { data } = useFlashcards()
  const cards = data?.flashcards ?? []

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-tertiary-400">
            <Layers className="w-3.5 h-3.5" />
            Repetição espacada • revisão guiada
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-[var(--text)]">
            Revisão Diária
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {total} flashcards criados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            onClick={onReview}
            disabled={total === 0}
            className="h-9 rounded-full border border-secondary-500/30 bg-secondary-500/15 px-4 text-[13px] font-semibold text-secondary-300 hover:bg-secondary-500/25 hover:text-secondary-300"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Revisar
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-400/15 px-3 py-1.5 text-[11px] font-bold text-tertiary-400">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary-400" />
            Sessão Ativa
          </span>
        </div>
      </div>

      <SessionProgressCards cards={cards} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onCreate}
          className="h-12 flex-1 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40"
        >
          <Plus className="mr-2 h-4 w-4" />
          Criar Deck
        </Button>
        <Button
          variant="secondary"
          onClick={onCreate}
          className="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] font-semibold text-[var(--text)] hover:border-primary-500/40"
        >
          <Sparkles className="mr-2 h-4 w-4 text-secondary-300" />
          Importar com IA
        </Button>
      </div>
    </div>
  )
}
