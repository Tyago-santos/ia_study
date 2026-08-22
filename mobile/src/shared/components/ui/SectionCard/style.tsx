import { styled } from '@/shared/styles'

export const Container = styled.View`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`

export const Title = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Body = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`
