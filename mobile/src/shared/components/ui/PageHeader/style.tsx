import { styled } from '@/shared/styles'

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const TitleBlock = styled.View`
  flex: 1;
  gap: 2px;
`

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Subtitle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Action = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.accent};
`

export const ActionLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onAccent};
`
