import { styled } from '@/shared/styles'

export const Backdrop = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: rgba(0, 0, 0, 0.55);
`

/* Cobre o backdrop inteiro so para capturar o toque que fecha o modal. */
export const BackdropFill = styled.Pressable`
  outline-style: none;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`

export const Card = styled.View`
  width: 100%;
  max-width: 340px;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const Title = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Message = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Actions = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const CancelButton = styled.Pressable`
  flex: 1;
  outline-style: none;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  justify-content: center;
  border-color: ${({ theme }) => theme.colors.border};
`

export const CancelLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const ConfirmButtonWrapper = styled.View`
  flex: 1;
`
