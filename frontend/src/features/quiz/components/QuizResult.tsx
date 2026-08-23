import { RotateCcw } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { scoreColor, scoreFeedback } from '@/features/quiz/lib/scoring'
import { ScoreRing } from './ScoreRing'

interface QuizResultProps {
  quizTitle: string
  percentage: number
  score: number
  total: number
  onRetry: () => void
  onBack: () => void
}

export function QuizResult({
  quizTitle,
  percentage,
  score,
  total,
  onRetry,
  onBack,
}: QuizResultProps) {
  const { icon: Icon, message } = scoreFeedback(percentage)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] animate-fade-in">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-secondary)] mb-2">
            <Icon className={cn('w-7 h-7', scoreColor(percentage))} />
          </div>
          <CardTitle className="text-xl">{message}</CardTitle>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{quizTitle}</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ScoreRing percentage={percentage} />
          <p className="text-[var(--text-secondary)] mt-5 mb-6">
            Você acertou <span className="font-semibold text-[var(--text)]">{score}</span> de{' '}
            <span className="font-semibold text-[var(--text)]">{total}</span> questões
          </p>
          <div className="flex gap-2 w-full">
            <Button variant="secondary" className="flex-1" onClick={onRetry}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Refazer
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
