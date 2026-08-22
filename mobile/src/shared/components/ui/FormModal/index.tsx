import { Ionicons } from '@expo/vector-icons'
import type { PropsWithChildren } from 'react'
import { Modal, Platform, Pressable } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useTheme } from '@/shared/hooks/useTheme'
import { Button } from '../Button'
import * as S from './style'

interface FormModalProps extends PropsWithChildren {
  open: boolean
  title: string
  onClose: () => void
  onSubmit?: () => void
  submitLabel?: string
  isSubmitting?: boolean
  submitDisabled?: boolean
}

export function FormModal({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = 'Salvar',
  isSubmitting,
  submitDisabled,
  children,
}: FormModalProps) {
  const { colors } = useTheme()

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <S.Backdrop behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <S.BackdropFill onPress={onClose} />

        <S.Sheet>
          <S.Header>
            <S.Title>{title}</S.Title>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </S.Header>

          {/* Scroll sensível ao teclado: inputs na base do form nao ficam atras dele */}
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <S.Body>{children}</S.Body>
          </KeyboardAwareScrollView>

          {onSubmit ? (
            <S.Footer>
              <Button
                title={submitLabel}
                onPress={onSubmit}
                loading={isSubmitting}
                disabled={submitDisabled}
              />
            </S.Footer>
          ) : null}
        </S.Sheet>
      </S.Backdrop>
    </Modal>
  )
}
