import { styled } from '@/shared/styles'

export const Wrapper = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Field = styled.TextInput<{ $hasError?: boolean }>`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 4}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  border-color: ${({ theme, $hasError }) =>
    $hasError ? theme.colors.danger : theme.colors.border};
`

export const ErrorText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`
