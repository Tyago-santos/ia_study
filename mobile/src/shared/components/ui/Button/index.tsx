import { ActivityIndicator } from 'react-native'
import { Tints } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { Gradient } from '../Gradient'
import * as S from './style'
import type { ButtonVariant } from './style'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
}

export function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const { colors } = useTheme()
  const isDisabled = disabled || loading

  return (
    <S.Container
      onPress={onPress}
      disabled={isDisabled}
      $variant={variant}
      $disabled={isDisabled}
      // O feedback de toque depende do estado que so o Pressable conhece, entao
      // sai por aqui e o styled-components mescla com o estilo gerado.
      style={({ pressed }) => (pressed && !isDisabled ? { opacity: 0.85 } : null)}
    >
      {/* Gradiente decorativo: cobre o fundo solido do botao, sem receber
          toque. So' no primario — o secundario e' transparente por definicao
          e o perigo mantem cor unica para o alerta continuar legivel. */}
      {variant === 'primary' && !isDisabled ? (
        <Gradient from={colors.accent} to={Tints.violet} axis="horizontal" />
      ) : null}

      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.accentText : colors.onAccent} />
      ) : (
        <S.Label $variant={variant}>{title}</S.Label>
      )}
    </S.Container>
  )
}
