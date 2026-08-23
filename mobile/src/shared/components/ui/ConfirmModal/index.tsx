import { Modal } from 'react-native'
import { Button } from '../Button'
import * as S from './style'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  /** Acao irreversivel (ex.: apagar) pinta o botao de confirmar de vermelho. */
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Confirmacao no visual do app, no lugar do `Alert.alert` nativo do sistema. */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onCancel}>
      <S.Backdrop>
        <S.BackdropFill onPress={onCancel} />

        <S.Card>
          <S.Title>{title}</S.Title>
          <S.Message>{message}</S.Message>

          <S.Actions>
            <S.CancelButton
              onPress={onCancel}
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : null)}
            >
              <S.CancelLabel>{cancelLabel}</S.CancelLabel>
            </S.CancelButton>

            <S.ConfirmButtonWrapper>
              <Button
                title={confirmLabel}
                onPress={onConfirm}
                variant={destructive ? 'danger' : 'primary'}
              />
            </S.ConfirmButtonWrapper>
          </S.Actions>
        </S.Card>
      </S.Backdrop>
    </Modal>
  )
}
