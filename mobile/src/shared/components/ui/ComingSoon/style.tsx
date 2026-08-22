import { styled } from '@/shared/styles'

export const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`

export const Subtitle = styled.Text`
  font-size: 15px;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
