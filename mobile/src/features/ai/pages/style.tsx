import { styled } from '@/shared/styles'

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`

export const HeaderIcon = styled.View`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent};
`

export const HeaderText = styled.View`
  flex: 1;
  gap: 1px;
`

export const HeaderTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const HeaderSubtitle = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* KeyboardAwareScrollView: rola ate o input focado ficar acima do teclado.
   Importado no AIPage em vez de definido aqui porque tem props nativas. */
export const Messages = styled.ScrollView.attrs(({ theme }) => ({
  keyboardShouldPersistTaps: 'handled' as const,
  contentContainerStyle: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
}))`
  flex: 1;
`
