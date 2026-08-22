import { styled } from '@/shared/styles'

export const Filters = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const Hint = styled.Text`
  font-size: 12px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const FieldLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`
