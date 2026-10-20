import { styled } from '@/shared/styles'

export const List = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

/* Rotulo igual ao do input compartilhado (13/600 + tracking), secundário —
   lido como rotulo de campo, nao como parte do texto do modal. */
export const FieldLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
