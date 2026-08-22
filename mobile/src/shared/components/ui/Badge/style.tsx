import { styled } from '@/shared/styles'

export const Container = styled.View<{ $tint: string }>`
  align-self: flex-start;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 3px;
  background-color: ${({ $tint }) => `${$tint}22`};
  border-color: ${({ $tint }) => `${$tint}55`};
`

export const Label = styled.Text<{ $tint: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $tint }) => $tint};
`
