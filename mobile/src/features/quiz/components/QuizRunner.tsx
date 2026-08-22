import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { Button } from '@/shared/components/ui/Button'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { Screen } from '@/shared/components/ui/Screen'
import { useTheme } from '@/shared/hooks/useTheme'
import type { Quiz } from '@/shared/types'
import * as S from './style'

interface QuizRunnerProps {
  quiz: Quiz
  questionIndex: number
  answers: Record<string, number>
  isSubmitting: boolean
  onAnswer: (questionId: string, optionIndex: number) => void
  onNext: () => void
  onSubmit: () => void
  onExit: () => void
}

/** Uma questao por vez, com a barra medindo o avanco dentro do quiz. */
export function QuizRunner({
  quiz,
  questionIndex,
  answers,
  isSubmitting,
  onAnswer,
  onNext,
  onSubmit,
  onExit,
}: QuizRunnerProps) {
  const { colors } = useTheme()

  const question = quiz.questions[questionIndex]
  const selected = answers[question.id]
  const isLast = questionIndex === quiz.questions.length - 1

  return (
    <Screen scroll>
      <S.RunnerHeader>
        <Pressable onPress={onExit} hitSlop={8}>
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
        <S.RunnerTitle numberOfLines={1}>{quiz.title}</S.RunnerTitle>
        <S.RunnerCount>
          {questionIndex + 1}/{quiz.questions.length}
        </S.RunnerCount>
      </S.RunnerHeader>

      <ProgressBar value={((questionIndex + 1) / quiz.questions.length) * 100} />

      <S.QuestionBlock>
        <S.Question>{question.question}</S.Question>

        {question.options.map((option, index) => {
          const isSelected = selected === index

          return (
            <S.Option
              key={option}
              onPress={() => onAnswer(question.id, index)}
              $selected={isSelected}
            >
              <S.OptionMarker $selected={isSelected}>
                {isSelected ? <S.OptionDot /> : null}
              </S.OptionMarker>
              <S.OptionLabel>{option}</S.OptionLabel>
            </S.Option>
          )
        })}
      </S.QuestionBlock>

      <Button
        title={isLast ? 'Finalizar quiz' : 'Próxima questão'}
        disabled={selected === undefined}
        loading={isSubmitting}
        onPress={isLast ? onSubmit : onNext}
      />
    </Screen>
  )
}
