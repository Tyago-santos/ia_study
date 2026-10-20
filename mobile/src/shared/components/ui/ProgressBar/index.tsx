import { Tints } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { Gradient } from '../Gradient'
import * as S from './style'

interface ProgressBarProps {
  /** 0 a 100. Valores fora do intervalo sao aparados. */
  value: number
  color?: string
  height?: number
}

/**
 * Barra de progresso.
 *
 * Sem `color` ela sobe em gradiente indigo -> ciano, o par de marca — e' o
 * mesmo recurso da barra de maestria da referencia do Stitch. Quem passa
 * `color` continua mandando: nesse caso vira cor unica, para quem usa a barra
 * como indicador de uma materia/estado especifico nao ter a marca por cima da
 * informacao.
 */
export function ProgressBar({ value, color, height = 8 }: ProgressBarProps) {
  const { colors } = useTheme()
  const pct = Math.max(0, Math.min(100, value))

  return (
    <S.Track $height={height}>
      {color ? (
        <S.Fill $pct={pct} $height={height} $color={color} />
      ) : (
        <S.GradientFill $pct={pct} $height={height}>
          <Gradient from={colors.accent} to={Tints.sky} axis="horizontal" />
        </S.GradientFill>
      )}
    </S.Track>
  )
}
