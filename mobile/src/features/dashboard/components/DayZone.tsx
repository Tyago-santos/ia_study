import { Ionicons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDuration } from '../services/planner.service'
import * as S from './style'

interface DayZoneProps {
  dayIndex: number
  dayName: string
  /** Soma da duracao dos blocos do dia; 0 esconde o rotulo. */
  totalMinutes: number
  hovered: SharedValue<number>
  registerRef: (node: View | null) => void
  onLayout: () => void
  children: ReactNode
}

export function DayZone({
  dayIndex,
  dayName,
  totalMinutes,
  hovered,
  registerRef,
  onLayout,
  children,
}: DayZoneProps) {
  const { colors } = useTheme()

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: hovered.value === dayIndex ? colors.accent : colors.border,
    backgroundColor: hovered.value === dayIndex ? `${colors.accent}18` : 'transparent',
  }))

  return (
    <S.DayContainer style={animatedStyle}>
      {/* View cru: este wrapper nao tem estilo, existe so para carregar
          a ref que o arrasto mede. */}
      <View ref={registerRef} onLayout={onLayout} collapsable={false}>
        <S.DayHeader>
          <S.DayName>{dayName}</S.DayName>

          {totalMinutes > 0 ? (
            <S.DayTotal>
              <Ionicons name="time-outline" size={11} color={colors.accentText} />
              <S.DayTotalText>{formatDuration(totalMinutes)}</S.DayTotalText>
            </S.DayTotal>
          ) : null}
        </S.DayHeader>

        <S.DayBlocks>{children}</S.DayBlocks>
      </View>
    </S.DayContainer>
  )
}
