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
          // hover so vira o card em aparelhos COM mouse; no toque, so o clique
          // (estado `flipped`) controla — antes o :hover grudava e travava
          '[@media(hover:hover)]:group-hover:[transform:rotateY(180deg)]',
          flipped && '[transform:rotateY(180deg)]'
        )}
        onClick={onFlip}
      >
        {/* Front face */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden] rounded-2xl border p-5 flex flex-col justify-between',
            'bg-[var(--card-bg)] border-[var(--border)] backdrop-blur-sm shadow-[var(--glass-shadow)]',
            'transition-shadow duration-300 group-hover:shadow-lg'
          )}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              {subject && (
                <span
                  className="max-w-[60%] truncate rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{ backgroundColor: `${subject.color}26`, color: subject.color }}
                >
                  {subject.name}
                </span>
              )}
              <span
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold',
                  difficulty.badge
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', difficulty.dot)} />
                {difficulty.label}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Pergunta
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {flashcard.reviewCount} revisões
              </span>
            </div>
            <p className="mt-1.5 text-base font-medium text-[var(--text)] leading-snug">
              {flashcard.front}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <HelpCircle className="w-3.5 h-3.5" />
              Toque para ver a resposta
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
            'bg-primary-500/10 border-primary-500/25 backdrop-blur-sm shadow-[var(--glass-shadow)]'
          )}
        >
          <div>
            <span className="flex items-center gap-1.5 text-[var(--accent-text)]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">Resposta</span>
            </span>
            <p className="mt-3 text-base font-medium text-[var(--text)] leading-snug">
              {flashcard.back}
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <HelpCircle className="w-3.5 h-3.5" />
            Toque para ver a pergunta
          </span>
        </div>
      </div>
    </div>
  )
}
