import { Layers, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface FlashcardsHeaderProps {
  total: number
  onCreate: () => void
}

export function FlashcardsHeader({ total, onCreate }: FlashcardsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 items-center justify-center text-[var(--accent-text)] box-glow">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Flashcards</h1>
          <p className="text-[var(--text-secondary)]">{total} flashcards criados</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1 sm:flex-none">
          <RotateCcw className="w-4 h-4 mr-2" />
          Revisar
        </Button>
        <Button onClick={onCreate} className="flex-1 sm:flex-none">
          <Plus className="w-4 h-4 mr-2" />
          Criar Flashcard
        </Button>
      </div>
    </div>
  )
}
