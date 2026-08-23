import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { type LayoutChangeEvent, Pressable } from 'react-native'
import { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
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

  const flip = useSharedValue(0)
  useEffect(() => {
    flip.value = withTiming(flipped ? 1 : 0, { duration: 300 })
  }, [flipped, flip])

  /* A face de tras e absoluta pra sobrepor a da frente, entao o palco precisa
     de uma altura explicita: a maior entre as duas, medida no layout. */
  const [frontHeight, setFrontHeight] = useState(0)
  const [backHeight, setBackHeight] = useState(0)
  const onFrontLayout = (event: LayoutChangeEvent) => setFrontHeight(event.nativeEvent.layout.height)
  const onBackLayout = (event: LayoutChangeEvent) => setBackHeight(event.nativeEvent.layout.height)

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
  }))

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
  }))

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

      <S.FlipStage style={{ height: Math.max(frontHeight, backHeight) || undefined }}>
        <S.FlipFace style={frontStyle} onLayout={onFrontLayout}>
          <S.CardSide>PERGUNTA</S.CardSide>
          <S.CardContent>{flashcard.front}</S.CardContent>
        </S.FlipFace>

        <S.FlipFace
          style={[{ position: 'absolute', top: 0, left: 0, right: 0 }, backStyle]}
          onLayout={onBackLayout}
        >
          <S.CardSide>RESPOSTA</S.CardSide>
          <S.CardContent>{flashcard.back}</S.CardContent>
        </S.FlipFace>
      </S.FlipStage>

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
