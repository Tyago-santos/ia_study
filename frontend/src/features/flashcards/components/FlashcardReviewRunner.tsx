import { CheckCircle2, HelpCircle, LogOut } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { cn } from '@/shared/lib/utils'
import type { Flashcard, Subject } from '@/shared/types'

interface FlashcardReviewRunnerProps {
  card: Flashcard
  subject?: Subject
  index: number
  total: number
  flipped: boolean
  onFlip: () => void
  onRate: (difficulty: Flashcard['difficulty']) => void
  onExit: () => void
}

const RATING_OPTIONS: { difficulty: Flashcard['difficulty']; label: string; className: string }[] = [
  {
    difficulty: 'hard',
    label: 'Difícil',
    className: 'border-error-500/30 text-error-600 hover:bg-error-500/10',
  },
  {
    difficulty: 'medium',
    label: 'Médio',
    className: 'border-warning-500/30 text-warning-600 hover:bg-warning-500/10',
  },
  {
    difficulty: 'easy',
    label: 'Fácil',
    className: 'border-success-500/30 text-success-600 hover:bg-success-500/10',
  },
]

export function FlashcardReviewRunner({
  card,
  subject,
  index,
  total,
  flipped,
  onFlip,
  onRate,
  onExit,
}: FlashcardReviewRunnerProps) {
  const SubjectIcon = subject ? getSubjectIcon(subject.icon) : null

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] animate-fade-in">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {subject && SubjectIcon && (
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                  style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}cc)` }}
                >
                  <SubjectIcon className="w-4 h-4 text-[var(--on-accent)]" />
                </span>
              )}
              <CardTitle className="truncate">{subject?.name ?? 'Revisão'}</CardTitle>
            </div>
            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-500/10 text-[var(--accent-text)]">
              {index + 1} / {total}
            </span>
          </div>
          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            onClick={onFlip}
            className={cn(
              'w-full min-h-[14rem] rounded-2xl border p-6 flex flex-col items-center justify-center text-center gap-4',
              'transition-colors duration-200',
              flipped
                ? 'bg-primary-500/5 border-primary-500/20'
                : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-primary-500/40'
            )}
          >
            {flipped ? (
              <>
                <span className="flex items-center gap-1.5 text-[var(--accent-text)]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Resposta</span>
                </span>
                <p className="text-lg font-medium text-[var(--text)] leading-snug">{card.back}</p>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Pergunta</span>
                </span>
                <p className="text-lg font-medium text-[var(--text)] leading-snug">{card.front}</p>
                <span className="text-[11px] text-[var(--text-secondary)] italic">
                  toque para ver a resposta
                </span>
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={onExit}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>

            {flipped ? (
              <div className="flex gap-2">
                {RATING_OPTIONS.map((option) => (
                  <Button
                    key={option.difficulty}
                    variant="secondary"
                    className={cn('border bg-transparent', option.className)}
                    onClick={() => onRate(option.difficulty)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            ) : (
              <Button onClick={onFlip}>Virar card</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
