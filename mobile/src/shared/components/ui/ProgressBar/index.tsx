import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

interface ProgressBarProps {
  /** 0 a 100. Valores fora do intervalo sao aparados. */
  value: number
  color?: string
  height?: number
}

export function ProgressBar({ value, color, height = 8 }: ProgressBarProps) {
  const { colors } = useTheme()
  const pct = Math.max(0, Math.min(100, value))

  return (
    <S.Track $height={height}>
      <S.Fill $pct={pct} $height={height} $color={color ?? colors.accent} />
    </S.Track>
  )
}
