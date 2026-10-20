import { styled } from '@/shared/styles'

export const SubjectWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`

/* A borda acende na cor da materia quando o cartao esta aberto — e o unico
   sinal de qual painel de assuntos esta visivel abaixo. Fechado, ele entra na
   mesma geometria dos demais cards: raio 20, borda baixa no escuro e halo
   indigo em vez de sombra preta. */
export const SubjectCard = styled.Pressable<{ $color: string; $expanded: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme, $color, $expanded }) => {
    if ($expanded) return $color
    return theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border
  }};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

/* Badge circular: e' o mesmo circulo tintado dos tiles, com anel e glow na
   propria cor — o unico ponto saturado do card, entao e' ele que ancora o olho. */
export const SubjectIcon = styled.View<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
  border-width: 1px;
  border-color: ${({ $color }) => `${$color}33`};

  shadow-color: ${({ $color }) => $color};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  elevation: 3;
`

export const SubjectInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

/* Titulo de secao: corpo 16 com tracking negativo, mesma familia dos
   titulos dos paineis compartilhados. */
export const SubjectName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.colors.text};
`

export const SubjectMeta = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const TopicsPanel = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`

/* Label de 11 precisa de tracking para nao grudar no corpo pequeno. */
export const PlannedTotal = styled.Text<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
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

/* Pill de tempo: mesma geometria dos chips (full, 1f/55 da materia), que e' o
   que o app usa para tudo que e' rotulo curto com cor. */
export const TopicTime = styled.View<{ $color: string }>`
  flex-direction: row;
  align-items: center;
  gap: 3px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm + 2}px;
  padding-vertical: 4px;
  background-color: ${({ $color }) => `${$color}1f`};
  border-width: 1px;
  border-color: ${({ $color }) => `${$color}55`};
`

export const TopicTimeText = styled.Text<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
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

/* Campo preenchido como o input compartilhado: o limite vem do tom, nao de um
   contorno fechado — dentro do card um retangulo com borda dura competia. */
export const AddTopicInput = styled.TextInput`
  outline-style: none;
  flex: 1;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.06)' : theme.colors.border};
`

/* Botao de adicionar vira circulo com glow: e' um marcador de acao puntual, a
   mesma geometria reservada no app para badge e icone circular. */
export const AddTopicButton = styled.Pressable<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => $color};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  shadow-color: ${({ $color }) => $color};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.35;
  shadow-radius: 10px;
  elevation: 4;
`

export const TopicSpinner = styled.ActivityIndicator`
  padding: 9px;
`
