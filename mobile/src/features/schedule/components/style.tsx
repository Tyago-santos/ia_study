import { styled } from '@/shared/styles'

/* Evento atrasado ganha borda vermelha; concluido esmaece para sair do
   primeiro plano sem sumir da lista.

   O card usa o mesmo painel dos demais (raio 20 + halo indigo) para a lista
   do cronograma nao parecer um bloco solto ao lado dos outros cards. */
export const EventCard = styled.View<{ $overdue: boolean; $completed: boolean }>`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme, $overdue }) =>
    $overdue
      ? theme.colors.danger
      : theme.name === 'dark'
        ? 'rgba(255, 255, 255, 0.07)'
        : theme.colors.border};
  opacity: ${({ $completed }) => ($completed ? 0.6 : 1)};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const EventInfo = styled.View`
  flex: 1;
  flex-shrink: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const EventBadges = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

/* Título com tracking negativo: texto curto em negrito abre espaço entre as
   letras e fica "fofo" onde o card pede peso. */
export const EventTitle = styled.Text<{ $completed: boolean }>`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration-line: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
`

export const EventDescription = styled.Text`
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const EventDateRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

/* A data é o metadado que o olho busca ao decidir se abre o card: 600 deixa
   ela legível de relance sem competir com o título. */
export const EventDate = styled.Text<{ $overdue: boolean }>`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1px;
  color: ${({ theme, $overdue }) => ($overdue ? theme.colors.danger : theme.colors.textSecondary)};
`
