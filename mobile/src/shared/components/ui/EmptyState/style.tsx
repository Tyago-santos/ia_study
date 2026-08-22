import { styled } from '@/shared/styles'

export const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const Title = styled.Text`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`

export const Description = styled.Text`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`
