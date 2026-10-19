import { Hand, LogOut } from 'lucide-react'
import { Button, Card, CardContent, CardHeader } from '@/shared/components/ui'
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
    className: 'border-error-500/40 text-error-500 hover:bg-error-500/15',
  },
  {
    difficulty: 'medium',
    label: 'Médio',
    className: 'border-warning-500/40 text-warning-500 hover:bg-warning-500/15',
  },
  {
    difficulty: 'easy',
    label: 'Fácil',
    className: 'border-success-500/40 text-success-500 hover:bg-success-500/15',
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-12rem)] animate-fade-in">
      <Card className="w-full max-w-2xl border-[var(--border)]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            {subject && SubjectIcon ? (
              <span
                className="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ backgroundColor: `${subject.color}26`, color: subject.color }}
              >
                <SubjectIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{subject.name}</span>
              </span>
            ) : (
              <span className="truncate text-base font-semibold text-[var(--text)]">Revisão</span>
            )}
            <span className="shrink-0 rounded-full bg-secondary-500/15 px-2.5 py-1 text-[11px] font-bold text-secondary-300">
              Card {index + 1} de {total}
            </span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-tertiary-400 transition-all duration-300"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            onClick={onFlip}
            className={cn(
              'w-full min-h-[14rem] rounded-2xl border p-6 flex flex-col items-start justify-center text-left gap-3',
              'transition-colors duration-200',
              flipped
                ? 'bg-primary-500/10 border-primary-500/25'
                : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-primary-500/40'
            )}
          >
            {flipped ? (
              <>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-300">
                  Resposta
                </span>
                <p className="text-lg font-medium text-[var(--text)] leading-snug">{card.back}</p>
                <span className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                  <Hand className="w-3.5 h-3.5" />
                  Toque para ver a pergunta
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  Pergunta
                </span>
                <p className="text-xl font-semibold text-[var(--text)] leading-snug">{card.front}</p>
                <span className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                  <Hand className="w-3.5 h-3.5" />
                  Toque para ver a resposta
                </span>
              </>
            )}
          </button>

          {/* flex-wrap: em 360px "Sair + 3 botoes" nao cabe numa linha e a Card
              (overflow-hidden) cortaria o ultimo botao */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" onClick={onExit}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>

            {flipped ? (
              <div className="flex flex-wrap gap-2">
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
