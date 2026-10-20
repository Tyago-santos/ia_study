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
  /* No escuro a borda acesa vira linha ruidosa; o rgba corta o brilho. */
  border-bottom-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
`

/* Ícone do topo em pílula indigo com halo: mesmo tratamento dos badges dos
   cards, para o assistente ter a mesma "assinatura" visual do resto do app. */
export const HeaderIcon = styled.View`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  elevation: 3;
`

export const HeaderText = styled.View`
  flex: 1;
  gap: 1px;
`

export const HeaderTitle = styled.Text`
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.colors.text};
`

export const HeaderSubtitle = styled.Text`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1px;
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
