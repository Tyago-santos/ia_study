import { ActivityIndicator } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'
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
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.onAccent : colors.accentText} />
      ) : (
        <S.Label $variant={variant}>{title}</S.Label>
      )}
    </S.Container>
  )
}
