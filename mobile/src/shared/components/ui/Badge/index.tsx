import type { ViewStyle } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

interface BadgeProps {
  label: string
  /** Cor da materia/estado; usada com transparencia no fundo. */
  color?: string
  style?: ViewStyle
}

export function Badge({ label, color, style }: BadgeProps) {
  const { colors } = useTheme()
  const tint = color ?? colors.accent

  return (
    <S.Container $tint={tint} style={style}>
      <S.Label $tint={tint} numberOfLines={1}>
        {label}
      </S.Label>
    </S.Container>
  )
}
