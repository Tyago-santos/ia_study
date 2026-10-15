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
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-secondary)] mb-2">
            <PartyPopper className="w-7 h-7 text-[var(--accent-text)]" />
          </div>
          <CardTitle className="text-xl">Revisão concluída!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-[var(--text-secondary)] mb-6">
            Você revisou{' '}
            <span className="font-semibold text-[var(--text)]">
              {total} flashcard{total === 1 ? '' : 's'}
            </span>
          </p>
          <div className="flex gap-2 w-full">
            <Button variant="secondary" className="flex-1" onClick={onRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Revisar de novo
            </Button>
            <Button className="flex-1" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
