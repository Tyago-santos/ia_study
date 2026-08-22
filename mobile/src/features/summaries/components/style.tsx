import { styled } from '@/shared/styles'

export const Card = styled.Pressable`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const SourceIcon = styled.View<{ $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
`

export const CardHeaderInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const CardTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const CardContent = styled.Text`
  font-size: 13px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const CardFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const CardMeta = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const CardToggle = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accentText};
`
