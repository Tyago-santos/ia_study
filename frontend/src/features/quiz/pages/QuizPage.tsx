import { useMemo, useState } from 'react'
import { ListChecks } from 'lucide-react'
import { Card, CardContent, CardSkeleton, EmptyState, ErrorState } from '@/shared/components/ui'
import type { Subject } from '@/shared/types'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useQuizzes } from '@/features/quiz/hooks/useQuiz'
import { useQuizSession } from '@/features/quiz/hooks/useQuizSession'
import { summarizeQuizzes } from '@/features/quiz/lib/scoring'
import { CreateQuizModal } from '../components/CreateQuizModal'
import { QuizCard } from '../components/QuizCard'
import { QuizHeader } from '../components/QuizHeader'
import { QuizResult } from '../components/QuizResult'
import { QuizRunner } from '../components/QuizRunner'
import { SubjectFilter } from '../components/SubjectFilter'

export function QuizPage() {
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const { data: subjects } = useSubjects()
  const { data: allQuizzes } = useQuizzes()
  const { data: quizzes, isLoading, error, refetch } = useQuizzes(subjectFilter ?? undefined)

  const session = useQuizSession(allQuizzes)
  const stats = summarizeQuizzes(allQuizzes)

  const subjectById = useMemo(() => {
    const map = new Map<string, Subject>()
    for (const s of subjects ?? []) map.set(s.id, s)
    return map
  }, [subjects])

  if (error) {
    return <ErrorState message="Erro ao carregar quizzes" onRetry={refetch} />
  }

  if (session.activeQuiz) {
    const { activeQuiz } = session

    if (session.showResults) {
      return (
        <QuizResult
          quizTitle={activeQuiz.title}
          percentage={session.result?.percentage ?? 0}
          score={session.result?.score ?? 0}
          total={session.result?.total ?? activeQuiz.questions.length}
          onRetry={() => session.start(activeQuiz.id)}
          onBack={session.exit}
        />
      )
    }

    const question = activeQuiz.questions[session.currentQuestion]

    return (
      <QuizRunner
        quiz={activeQuiz}
        subject={subjectById.get(activeQuiz.subjectId)}
        currentQuestion={session.currentQuestion}
        selectedAnswer={session.answers[question.id]}
        isSubmitting={session.isSubmitting}
        onAnswer={session.answer}
        onNext={session.next}
        onExit={session.exit}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <QuizHeader
        total={stats.total}
        totalQuestions={stats.totalQuestions}
        completed={stats.completed}
        averageScore={stats.averageScore}
        onCreate={() => setIsCreating(true)}
      />

      <SubjectFilter
        subjects={subjects ?? []}
        value={subjectFilter}
        onChange={setSubjectFilter}
      />

      <CreateQuizModal open={isCreating} onClose={() => setIsCreating(false)} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : quizzes && quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              subject={subjectById.get(quiz.subjectId)}
              onStart={() => session.start(quiz.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={<ListChecks className="w-12 h-12" />}
              title={subjectFilter ? 'Nenhum quiz nesta matéria' : 'Nenhum quiz criado'}
              description={
                subjectFilter
                  ? 'Tente outra matéria ou crie um novo quiz.'
                  : "Clique em 'Criar Quiz' para começar!"
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
