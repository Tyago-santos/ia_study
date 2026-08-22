import { styled } from '@/shared/styles'

export const Tiles = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const Section = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const SubjectRow = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`

export const SubjectHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const SubjectName = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const SubjectValue = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const QuizRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`

export const QuizStat = styled.View`
  align-items: center;
  gap: 2px;
`

export const QuizValue = styled.Text<{ $highlight?: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme, $highlight }) => ($highlight ? theme.colors.accentText : theme.colors.text)};
`

export const QuizLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
