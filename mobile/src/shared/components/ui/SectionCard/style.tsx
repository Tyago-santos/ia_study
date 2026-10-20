import { styled } from '@/shared/styles'

export const Container = styled.View`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 16px;
  elevation: 2;
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`

export const Title = styled.Text`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.colors.text};
`

export const Body = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`
