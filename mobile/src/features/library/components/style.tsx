import { styled } from '@/shared/styles'

export const SubjectWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`

/* A borda acende na cor da materia quando o cartao esta aberto — e o unico
   sinal de qual painel de assuntos esta visivel abaixo. */
export const SubjectCard = styled.Pressable<{ $color: string; $expanded: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme, $color, $expanded }) => ($expanded ? $color : theme.colors.border)};
`

export const SubjectIcon = styled.View<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
`

export const SubjectInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const SubjectName = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const SubjectMeta = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const TopicsPanel = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`

export const PlannedTotal = styled.Text<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

export const TopicRow = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`

export const TopicName = styled.Text<{ $completed: boolean }>`
  flex: 1;
  font-size: 14px;
  color: ${({ theme, $completed }) =>
    $completed ? theme.colors.textSecondary : theme.colors.text};
  text-decoration-line: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
`

export const TopicTime = styled.View<{ $color: string }>`
  flex-direction: row;
  align-items: center;
  gap: 3px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 2px;
  background-color: ${({ $color }) => `${$color}22`};
`

export const TopicTimeText = styled.Text<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

export const EmptyTopics = styled.Text`
  font-size: 13px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const AddTopicRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`

export const AddTopicInput = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-color: ${({ theme }) => theme.colors.border};
`

export const AddTopicButton = styled.Pressable<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => $color};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const TopicSpinner = styled.ActivityIndicator`
  padding: 9px;
`
