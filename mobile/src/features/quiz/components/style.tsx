import { styled } from '@/shared/styles'

/* ------------------------------- Listagem ------------------------------- */

export const QuizCard = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const QuizInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const QuizTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
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
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.colors.text};
`

/* Contador em pílula indigo: transforma "3/10" num chip legível que destaca
   do título sem virar mais um texto cinza. */
export const RunnerCount = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm + 2}px;
  padding-vertical: 4px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => `${theme.colors.accent}1f`};
  color: ${({ theme }) => theme.colors.accentText};
`

export const QuestionBlock = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const Question = styled.Text`
  font-size: 18px;
  font-weight: 800;
  line-height: 25px;
  letter-spacing: -0.3px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text};
`

export const Option = styled.Pressable<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme, $selected }) =>
    $selected ? `${theme.colors.accent}22` : theme.colors.card};
  border-color: ${({ theme, $selected }) =>
    $selected ? `${theme.colors.accent}55` : theme.colors.border};
  /* Selecionada ganha halo indigo — a resposta escolhida "acende" na tela. */
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ $selected }) => ($selected ? 0.3 : 0.06)};
  shadow-radius: 10px;
  elevation: ${({ $selected }) => ($selected ? 3 : 1)};
`

/* Marcador radio com glow: o ponto indigo e' o unico elemento realmente
   "aceso", entao ele carrega o halo para o olho achar a resposta rapido. */
export const OptionMarker = styled.View<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 2px;
  align-items: center;
  justify-content: center;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.border};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 0px;
  shadow-opacity: ${({ $selected }) => ($selected ? 0.4 : 0)};
  shadow-radius: 6px;
  elevation: 2;
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

/* Nota em indigo: o numero e' a conclusao da tela, entao ele herda a cor da
   marca em vez de repetir o preto do texto. */
export const ResultScore = styled.Text`
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.colors.accentText};
`

export const ResultTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
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
