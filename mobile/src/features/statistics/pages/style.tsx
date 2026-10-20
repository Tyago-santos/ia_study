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

/* Nome da matéria na barra: 700 + tracking negativo para o texto curto não
   abrir espaço entre as letras e ficar frouxo ao lado do valor. */
export const SubjectName = styled.Text`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.colors.text};
`

/* Label pequeno: 11/700 com tracking é o mesmo peso dos chips, então o valor
   lê como legenda da barra e não como segundo título. */
export const SubjectValue = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const QuizRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`

export const QuizStat = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

/* Número grande: mesmo peso do StatTile (800 + tracking negativo) para os
   três valores do bloco terem a mesma solidez dos tiles de cima. */
export const QuizValue = styled.Text<{ $highlight?: boolean }>`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${({ theme, $highlight }) => ($highlight ? theme.colors.accentText : theme.colors.text)};
`

/* Label do número: 11/700 com tracking, igual aos demais labels do app. */
export const QuizLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
