import { styled } from '@/shared/styles'

export const Backdrop = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.55);
`

/** Cobre o backdrop inteiro so para capturar o toque que fecha o modal. */
export const BackdropFill = styled.Pressable`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`

export const Sheet = styled.View`
  max-height: 88%;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-top-left-radius: ${({ theme }) => theme.radius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`

export const Title = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Body = styled.ScrollView.attrs(({ theme }) => ({
  keyboardShouldPersistTaps: 'handled' as const,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
}))``

export const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`
