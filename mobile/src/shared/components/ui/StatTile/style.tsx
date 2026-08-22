import { styled } from '@/shared/styles'

export const Container = styled.View`
  flex-grow: 1;
  flex-basis: 46%;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const IconBadge = styled.View<{ $tint: string }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $tint }) => `${$tint}22`};
`

export const Trend = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
`

export const TrendText = styled.Text<{ $tint: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $tint }) => $tint};
`

export const Value = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Label = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
