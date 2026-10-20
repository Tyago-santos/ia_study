import { styled } from '@/shared/styles'

export const Filters = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const Hint = styled.Text`
  font-size: 12px;
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.accentText};
`

export const FieldLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`
