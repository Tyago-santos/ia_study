import { styled } from '@/shared/styles'

/* ------------------------------- Listagem ------------------------------- */

export const QuizCard = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const QuizInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const QuizTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const QuizMeta = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------------ Em andamento ---------------------------- */

export const RunnerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`

export const RunnerTitle = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const RunnerCount = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const QuestionBlock = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const Question = styled.Text`
  font-size: 17px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text};
`

export const Option = styled.Pressable<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme, $selected }) =>
    $selected ? `${theme.colors.accent}22` : theme.colors.card};
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.border};
`

export const OptionMarker = styled.View<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 2px;
  align-items: center;
  justify-content: center;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.border};
`

export const OptionDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.accent};
`

export const OptionLabel = styled.Text`
  flex: 1;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`

/* -------------------------------- Resultado ------------------------------ */

export const ResultBody = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
`

export const ResultScore = styled.Text`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const ResultTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`

export const ResultMeta = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const ResultActions = styled.View`
  align-self: stretch;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`
