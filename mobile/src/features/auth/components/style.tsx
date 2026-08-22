import { LOGO_BACKDROP } from '@/shared/constants/branding'
import { styled } from '@/shared/styles'

/* --- AuthCard --- */

export const Brand = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`

/* O emblema fica num badge escuro proprio: e neon desenhado sobre preto e
   perderia contraste direto nos temas Claro e Leitura. */
export const LogoBadge = styled.View`
  width: 88px;
  height: 88px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${LOGO_BACKDROP};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

export const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
`

export const BrandName = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentText};
`

export const CardTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const CardSubtitle = styled.Text`
  font-size: 14px;
  margin-top: ${({ theme }) => -theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* --- LoginForm / RegisterForm --- */

export const Form = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const FormError = styled.Text`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.danger};
`
