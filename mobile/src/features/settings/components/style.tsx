import { styled } from '@/shared/styles'

export const OptionRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const Option = styled.Pressable<{ $active: boolean; $tall?: boolean }>`
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-vertical: ${({ theme, $tall }) =>
    $tall ? theme.spacing.md : theme.spacing.sm + 2}px;
  background-color: ${({ theme, $active }) =>
    $active ? `${theme.colors.accent}22` : theme.colors.bgSecondary};
  border-color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
`

export const OptionLabel = styled.Text<{ $active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};
`

/* A partir do segundo item uma linha separa as opcoes; no primeiro ela viraria
   um risco solto logo abaixo do titulo da secao. */
export const SettingRow = styled.View<{ $divided?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: ${({ $divided }) => ($divided ? '1px' : '0px')};
  border-top-color: ${({ theme }) => theme.colors.border};
`

export const SettingInfo = styled.View`
  flex: 1;
  gap: 1px;
`

export const SettingName = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const SettingHint = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
