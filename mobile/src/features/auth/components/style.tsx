import { Tints } from '@/shared/constants/theme'
import { LOGO_BACKDROP } from '@/shared/constants/branding'
import { styled } from '@/shared/styles'

/* --- AuthCard --- */

export const Brand = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`

/* O emblema ja' traz o proprio quadrado indigo com cantos arredondados,
   entao o badge atras dele e' transparente e sem radius proprio — qualquer
   radius aqui cortaria os cantos da imagem. */
export const LogoBadge = styled.View`
  width: 88px;
  height: 88px;
  background-color: ${LOGO_BACKDROP};
  align-items: center;
  justify-content: center;
`

/**
 * Aura da marca.
 *
 * O halo mora na imagem e nao no badge: o PNG tem cantos transparentes, entao
 * a sombra nasce exatamente no contorno arredondado do quadrado — que e' o
 * efeito da referencia (um brilho violeta envolvendo o emblema). Se o halo
 * fosse do badge, ele nasceria num retangulo opaco e apareceria canto reto.
 */
export const LogoImage = styled.Image`
  width: 100%;
  height: 100%;

  shadow-color: ${Tints.violet};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.55;
  shadow-radius: 20px;
  elevation: 8;
`

export const BrandName = styled.Text`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: ${({ theme }) => theme.colors.text};
`

/** A segunda parte do nome ("IA") vira cyan: e' o destaque da marca na
 *  referencia, e o ciano e' a cor que o tema ja' usa para "status ativo". */
export const BrandAccent = styled.Text`
  color: ${({ theme }) =>
    theme.name === 'dark' ? '#4cd7f6' : theme.colors.accentText};
`

export const CardTitle = styled.Text`
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: ${({ theme }) => theme.colors.text};
`

export const CardSubtitle = styled.Text`
  font-size: 15px;
  line-height: 21px;
  margin-top: ${({ theme }) => -theme.spacing.xs}px;
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
