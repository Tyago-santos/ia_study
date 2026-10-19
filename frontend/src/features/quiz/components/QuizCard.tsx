import { HelpCircle, Play, RotateCcw, Target } from 'lucide-react'
import { Button, Card } from '@/shared/components/ui'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { cn } from '@/shared/lib/utils'
import type { Quiz, Subject } from '@/shared/types'
import { scoreColor } from '@/features/quiz/lib/scoring'

interface QuizCardProps {
  quiz: Quiz
  subject?: Subject
  onStart: () => void
}

export function QuizCard({ quiz, subject, onStart }: QuizCardProps) {
  const Icon = subject ? getSubjectIcon(subject.icon) : HelpCircle
  const color = subject?.color ?? '#4f46e5'
  const completed = quiz.score !== undefined

  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}, transparent 70%)` }}
      />
      <div className="relative flex items-start gap-3">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
          style={{ backgroundColor: `${color}1f` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[var(--text)] truncate">{quiz.title}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {subject?.name ?? 'Sem matéria'} · {quiz.questions.length} questões
          </p>
        </div>
      </div>

      {completed && (
        <div
          className={cn(
            'relative flex items-center gap-1.5 mt-3 text-xs font-medium',
            scoreColor(quiz.score!)
          )}
        >
          <Target className="w-3.5 h-3.5" />
          Última pontuação: {quiz.score}%
        </div>
      )}

      <Button
        className="relative w-full mt-4"
        onClick={onStart}
        variant={completed ? 'secondary' : 'primary'}
      >
        {completed ? (
          <>
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer Quiz
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Iniciar Quiz
          </>
        )}
      </Button>
    </Card>
  )
}
