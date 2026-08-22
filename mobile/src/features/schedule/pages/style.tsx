import { styled } from '@/shared/styles'

export const Tiles = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const List = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const FieldLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const TimeFields = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const TimeField = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const TimeInput = styled.TextInput`
  width: 90px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 15px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  border-color: ${({ theme }) => theme.colors.border};
`
