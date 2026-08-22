import { Link } from 'expo-router'
import { styled } from '@/shared/styles'

export const Footer = styled.Text`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const FooterLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accentText};
`
