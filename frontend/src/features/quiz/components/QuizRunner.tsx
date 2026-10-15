import { CheckCircle2, LogOut } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { cn } from '@/shared/lib/utils'
import type { Quiz, Subject } from '@/shared/types'
import { OPTION_LETTERS } from '@/features/quiz/lib/scoring'

interface QuizRunnerProps {
  quiz: Quiz
  subject?: Subject
  currentQuestion: number
  selectedAnswer?: number
  isSubmitting: boolean
  onAnswer: (questionId: string, answerIndex: number) => void
  onNext: () => void
  onExit: () => void
}

export function QuizRunner({
  quiz,
  subject,
  currentQuestion,
  selectedAnswer,
  isSubmitting,
  onAnswer,
  onNext,
  onExit,
}: QuizRunnerProps) {
  const question = quiz.questions[currentQuestion]
  const SubjectIcon = subject ? getSubjectIcon(subject.icon) : null
  const isLastQuestion = currentQuestion === quiz.questions.length - 1

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-12rem)] animate-fade-in">
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
              <CardTitle className="truncate">{quiz.title}</CardTitle>
            </div>
            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-500/10 text-[var(--accent-text)]">
              {currentQuestion + 1} / {quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-500/10 text-[var(--accent-text)] text-xs font-bold shrink-0 mt-0.5">
              {currentQuestion + 1}
            </span>
            <p className="text-lg font-medium text-[var(--text)] leading-snug">{question.question}</p>
          </div>
          <div className="space-y-2.5">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              return (
                <button
                  key={index}
                  onClick={() => onAnswer(question.id, index)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3.5 text-left rounded-xl border transition-all duration-150',
                    isSelected
                      ? 'border-primary-500 bg-primary-500/10 shadow-sm'
                      : 'border-[var(--border)] hover:border-primary-500/40 hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors',
                      isSelected
                        ? 'bg-primary-500 text-[var(--on-accent)]'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                    )}
                  >
                    {OPTION_LETTERS[index] ?? index + 1}
                  </span>
                  <span className="text-[var(--text)] flex-1">{option}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--accent-text)] shrink-0" />}
                </button>
              )
            })}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={onExit}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <Button onClick={onNext} disabled={selectedAnswer === undefined || isSubmitting}>
              {isLastQuestion ? 'Finalizar' : 'Próxima'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
