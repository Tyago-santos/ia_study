import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { AiGenerateButton } from '@/features/ai/components/AiGenerateButton'
import { Badge } from '@/shared/components/ui/Badge'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonBlock, SkeletonCard } from '@/shared/components/ui/Skeleton'
import { StatTile } from '@/shared/components/ui/StatTile'
import { Tints } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import * as C from '../components/style'
import { QuizResultCard } from '../components/QuizResultCard'
import { QuizRunner } from '../components/QuizRunner'
import { useQuizRunner } from '../hooks/useQuizRunner'
import { useQuizzes } from '../hooks/useQuizzes'
import { filterBySubject } from '../services/quiz.service'
import * as S from './style'

export function QuizPage() {
  const { colors } = useTheme()
  const { isLoading, subjects, quizzes, getSubject, completedCount, average } = useQuizzes()
  const runner = useQuizRunner()

  const [subjectFilter, setSubjectFilter] = useState<string | null>(null)

  const { activeQuiz } = runner

  if (isLoading) {
    return (
      <Screen scroll>
        <PageHeader title="Quiz" subtitle="Carregando..." />
        <S.Tiles>
          <SkeletonBlock width="47%" height={78} radius={16} />
          <SkeletonBlock width="47%" height={78} radius={16} />
        </S.Tiles>
        <SkeletonCard lines={2} style={{ marginTop: 16, marginBottom: 12 }} />
        <SkeletonCard lines={2} />
      </Screen>
    )
  }

  if (activeQuiz && runner.result) {
    return (
      <QuizResultCard
        quiz={activeQuiz}
        result={runner.result}
        onRetry={() => runner.start(activeQuiz)}
        onExit={runner.exit}
      />
    )
  }

  if (activeQuiz) {
    return (
      <QuizRunner
        quiz={activeQuiz}
        questionIndex={runner.questionIndex}
        answers={runner.answers}
        isSubmitting={runner.isSubmitting}
        onAnswer={runner.answer}
        onNext={runner.next}
        onSubmit={runner.submit}
        onExit={runner.exit}
      />
    )
  }

  const visible = filterBySubject(quizzes, subjectFilter)

  return (
    <Screen scroll>
      <PageHeader title="Quiz" subtitle={`${quizzes.length} quizzes disponíveis`} />

      <S.Tiles>
        <StatTile label="Concluídos" value={`${completedCount}`} icon="checkmark-done" />
        <StatTile label="Média" value={`${average}%`} icon="stats-chart" tint={Tints.cyan} />
      </S.Tiles>

      <S.Filters>
        <FilterChips
          value={subjectFilter}
          onChange={setSubjectFilter}
          options={[
            { value: null, label: 'Todas' },
            ...subjects.map((s) => ({ value: s.id, label: s.name, color: s.color })),
          ]}
        />
      </S.Filters>

      <AiGenerateButton kind="quiz" />

      {visible.length > 0 ? (
        visible.map((quiz) => {
          const subject = getSubject(quiz.subjectId)

          return (
            <C.QuizCard key={quiz.id} onPress={() => runner.start(quiz)}>
              <C.QuizInfo>
                <Badge label={subject?.name ?? 'Sem matéria'} color={subject?.color} />
                <C.QuizTitle>{quiz.title}</C.QuizTitle>
                <C.QuizMeta>
                  {quiz.questions.length} questões
                  {quiz.score !== undefined ? ` · último resultado ${quiz.score}%` : ''}
                </C.QuizMeta>
              </C.QuizInfo>

              <Ionicons name="play-circle" size={30} color={colors.accent} />
            </C.QuizCard>
          )
        })
      ) : (
        <SectionCard>
          <EmptyState
            icon="help-circle-outline"
            title="Nenhum quiz nesta matéria"
            description="Escolha outra matéria no filtro acima."
          />
        </SectionCard>
      )}
    </Screen>
  )
}
