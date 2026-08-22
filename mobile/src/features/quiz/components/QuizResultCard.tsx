import { Ionicons } from '@expo/vector-icons'
import { Button } from '@/shared/components/ui/Button'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { useTheme } from '@/shared/hooks/useTheme'
import type { Quiz } from '@/shared/types'
import { isPassing, type QuizResult } from '../services/quiz.service'
import * as S from './style'

interface QuizResultCardProps {
  quiz: Quiz
  result: QuizResult
  onRetry: () => void
  onExit: () => void
}

export function QuizResultCard({ quiz, result, onRetry, onExit }: QuizResultCardProps) {
  const { colors } = useTheme()
  const passed = isPassing(result.score)

  return (
    <Screen scroll centered>
      <SectionCard>
        <S.ResultBody>
          <Ionicons
            name={passed ? 'trophy' : 'refresh-circle'}
            size={56}
            color={passed ? colors.accent : colors.warning}
          />
          <S.ResultScore>{result.score}%</S.ResultScore>
          <S.ResultTitle>{quiz.title}</S.ResultTitle>
          <S.ResultMeta>
            {result.correct} de {result.total} corretas
          </S.ResultMeta>

          <S.ResultActions>
            <Button title="Refazer" onPress={onRetry} />
            <Button title="Voltar" variant="secondary" onPress={onExit} />
          </S.ResultActions>
        </S.ResultBody>
      </SectionCard>
    </Screen>
  )
}
