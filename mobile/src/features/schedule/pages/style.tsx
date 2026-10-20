import { styled } from '@/shared/styles'

export const Tiles = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const List = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

/* Mesmo peso do label dos Inputs (13/600): o 14 solto ficava mais forte que o
   proprio valor do campo e quebrava a hierarquia do formulario. */
export const FieldLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const TimeFields = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const TimeField = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`

/* Mesma leitura dos demais inputs: campo preenchido, nao contornado — sobre o
   marinho um contorno fechado em volta de 90px gritava mais que o botao. */
export const TimeInput = styled.TextInput`
  outline-style: none;
  width: 90px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.06)' : theme.colors.border};
`
