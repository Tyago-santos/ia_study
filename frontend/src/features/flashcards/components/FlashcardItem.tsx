import { CheckCircle2, Edit2, HelpCircle, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import type { Flashcard, Subject } from '@/shared/types'
import { DIFFICULTY_STYLES } from '@/features/flashcards/lib/difficulty'

interface FlashcardItemProps {
  flashcard: Flashcard
  subject?: Subject
  index: number
  flipped: boolean
  onFlip: () => void
  onDelete: () => void
}

export function FlashcardItem({
  flashcard,
  subject,
  index,
  flipped,
  onFlip,
  onDelete,
}: FlashcardItemProps) {
  const difficulty = DIFFICULTY_STYLES[flashcard.difficulty]

  return (
    <div
      className="group [perspective:1500px] h-64 animate-fade-in"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'backwards' }}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] cursor-pointer',
          'group-hover:[transform:rotateY(180deg)]',
          flipped && '[transform:rotateY(180deg)]'
        )}
        onClick={onFlip}
      >
        {/* Front face */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden] rounded-2xl border p-5 flex flex-col justify-between',
            'bg-[var(--card-bg)] border-[var(--glass-border)] backdrop-blur-sm shadow-[var(--glass-shadow)]',
            'transition-shadow duration-300 group-hover:shadow-lg'
          )}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border',
                  difficulty.badge
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', difficulty.dot)} />
                {difficulty.label}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {flashcard.reviewCount} revisões
              </span>
            </div>
            {subject && (
              <span className="inline-block text-[11px] font-medium text-[var(--accent-text)] bg-primary-500/10 px-2 py-0.5 rounded-md mb-3">
                {subject.name}
              </span>
            )}
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
              <p className="text-base font-medium text-[var(--text)] leading-snug">
                {flashcard.front}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-[11px] text-[var(--text-secondary)] italic">
              passe o mouse para virar
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Back face */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border p-5 flex flex-col justify-between',
            'bg-primary-500/5 border-primary-500/20 backdrop-blur-sm shadow-[var(--glass-shadow)]'
          )}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-3 text-[var(--accent-text)]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Resposta</span>
            </div>
            <p className="text-base font-medium text-[var(--text)] leading-snug">{flashcard.back}</p>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] italic">
            tire o mouse para ver a pergunta
          </span>
        </div>
      </div>
    </div>
  )
}
