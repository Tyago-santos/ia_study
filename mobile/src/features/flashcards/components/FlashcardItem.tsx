import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { Badge } from '@/shared/components/ui/Badge'
import { useTheme } from '@/shared/hooks/useTheme'
import type { Flashcard, Subject } from '@/shared/types'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../services/flashcards.service'
import * as S from './style'

interface FlashcardItemProps {
  flashcard: Flashcard
  subject?: Subject
  /** Virado mostra o verso; a borda acende na cor da materia. */
  flipped: boolean
  onFlip: () => void
  onRemove: () => void
}

export function FlashcardItem({
  flashcard,
  subject,
  flipped,
  onFlip,
  onRemove,
}: FlashcardItemProps) {
  const { colors } = useTheme()

  return (
    <S.Card
      onPress={onFlip}
      $borderColor={flipped ? (subject?.color ?? colors.accent) : colors.border}
    >
      <S.CardHeader>
        <Badge label={subject?.name ?? 'Sem matéria'} color={subject?.color} />
        <S.CardHeaderRight>
          <Badge
            label={DIFFICULTY_LABELS[flashcard.difficulty]}
            color={DIFFICULTY_COLORS[flashcard.difficulty]}
          />
          <Pressable onPress={onRemove} hitSlop={8}>
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </Pressable>
        </S.CardHeaderRight>
      </S.CardHeader>

      <S.CardSide>{flipped ? 'RESPOSTA' : 'PERGUNTA'}</S.CardSide>
      <S.CardContent>{flipped ? flashcard.back : flashcard.front}</S.CardContent>

      <S.CardFooter>
        <S.CardMeta>{flashcard.reviewCount} revisões</S.CardMeta>
        <Ionicons
          name={flipped ? 'arrow-undo-outline' : 'sync-outline'}
          size={14}
          color={colors.textSecondary}
        />
      </S.CardFooter>
    </S.Card>
  )
}
