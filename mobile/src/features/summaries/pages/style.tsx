import { styled } from '@/shared/styles'

export const List = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const FieldLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`
