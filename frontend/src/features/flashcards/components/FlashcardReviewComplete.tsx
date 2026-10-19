import { PartyPopper, RotateCcw } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'

interface FlashcardReviewCompleteProps {
  total: number
  onRestart: () => void
  onBack: () => void
}

export function FlashcardReviewComplete({ total, onRestart, onBack }: FlashcardReviewCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-12rem)] animate-fade-in">
      <Card className="w-full max-w-md border-[var(--border)] text-center">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30 mb-3">
            <PartyPopper className="w-7 h-7 text-white" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-tertiary-400">
            Sessão concluída
          </p>
          <CardTitle className="mt-1 text-xl font-bold">Revisão concluída!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Você revisou{' '}
            <span className="font-semibold text-[var(--text)]">
              {total} flashcard{total === 1 ? '' : 's'}
            </span>
          </p>
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              className="flex-1 rounded-xl border border-[var(--border)] font-semibold"
              onClick={onRestart}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Revisar de novo
            </Button>
            <Button
              className="flex-1 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 font-semibold text-white hover:shadow-lg hover:shadow-primary-500/40"
              onClick={onBack}
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
