import { styled } from '@/shared/styles'

export const SearchBox = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const SearchInput = styled.TextInput`
  flex: 1;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 4}px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`

export const ColorLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const ColorRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

/* A borda so aparece na cor escolhida; nas demais fica transparente para o
   circulo nao mudar de tamanho ao selecionar. */
export const ColorDot = styled.Pressable<{ $color: string; $selected: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 2px;
  background-color: ${({ $color }) => $color};
  border-color: ${({ theme, $selected }) => ($selected ? theme.colors.text : 'transparent')};
`
