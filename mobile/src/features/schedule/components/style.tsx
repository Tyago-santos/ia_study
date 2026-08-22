import { styled } from '@/shared/styles'

/* Evento atrasado ganha borda vermelha; concluido esmaece para sair do
   primeiro plano sem sumir da lista. */
export const EventCard = styled.View<{ $overdue: boolean; $completed: boolean }>`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme, $overdue }) => ($overdue ? theme.colors.danger : theme.colors.border)};
  opacity: ${({ $completed }) => ($completed ? 0.6 : 1)};
`

export const EventInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const EventBadges = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const EventTitle = styled.Text<{ $completed: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-decoration-line: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
`

export const EventDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const EventDateRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const EventDate = styled.Text<{ $overdue: boolean }>`
  font-size: 12px;
  color: ${({ theme, $overdue }) => ($overdue ? theme.colors.danger : theme.colors.textSecondary)};
`
