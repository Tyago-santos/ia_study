import { forwardRef } from 'react'
import type { TextInput, TextInputProps } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

interface InputProps extends TextInputProps {
  label: string
  error?: string
}

export const Input = forwardRef<TextInput, InputProps>(({ label, error, ...rest }, ref) => {
  const { colors } = useTheme()

  return (
    <S.Wrapper>
      <S.Label>{label}</S.Label>
      <S.Field
        ref={ref}
        $hasError={Boolean(error)}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        {...rest}
      />
      {error ? <S.ErrorText>{error}</S.ErrorText> : null}
    </S.Wrapper>
  )
})
Input.displayName = 'Input'
