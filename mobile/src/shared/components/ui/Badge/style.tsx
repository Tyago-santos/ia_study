import { styled } from '@/shared/styles'

/**
 * Chip de status/materia.
 *
 * Mantem a caixa como o texto veio (o Stitch alterna entre "IA Ativa" e
 * "MESTRE DO FOCO" sem uniformizar), so' ganha o tracking leve do `label-sm`
 * — a peca pequena precisa de espaco entre letras pra nao grudar no corpo 11.
 */
export const Container = styled.View<{ $tint: string }>`
  align-self: flex-start;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm + 2}px;
  padding-vertical: 4px;
  background-color: ${({ $tint }) => `${$tint}1f`};
  border-color: ${({ $tint }) => `${$tint}55`};

  shadow-color: ${({ $tint }) => $tint};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  elevation: 2;
`

export const Label = styled.Text<{ $tint: string }>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ $tint }) => $tint};
`
