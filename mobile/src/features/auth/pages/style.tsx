import { Link } from 'expo-router'
import { styled } from '@/shared/styles'

export const Footer = styled.Text`
  font-size: 14px;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/** Sublinhado para o link nao depender so' da cor: no papel ambar o cyan perde
 *  contraste, e a linha e' a pista que sobra em qualquer tema. */
export const FooterLink = styled(Link)`
  font-weight: 700;
  text-decoration-line: underline;
  color: ${({ theme }) => theme.colors.accentText};
`
