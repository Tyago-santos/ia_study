import { LOGO_BACKDROP } from '@/shared/constants/branding'
import { Tints } from '@/shared/constants/theme'
import { styled } from '@/shared/styles'

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.card};
`

export const Header = styled.View<{ $topInset: number }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme, $topInset }) => $topInset + theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`

/* A marca ja' traz o proprio quadrado indigo com cantos arredondados, entao
   o badge atras dela e' transparente e sem radius proprio — qualquer radius
   aqui cortaria os cantos da imagem. */
export const LogoBadge = styled.View`
  width: 38px;
  height: 38px;
  background-color: ${LOGO_BACKDROP};
  align-items: center;
  justify-content: center;
`

/** Aura da marca no drawer — mesmo recurso do login, para o app inteiro
 *  respirar a mesma identidade. O halo nasce nos cantos do PNG, nao no badge. */
export const LogoImage = styled.Image`
  width: 100%;
  height: 100%;

  shadow-color: ${Tints.violet};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`

export const LogoText = styled.Text`
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.accentText};
`

export const Menu = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`

export const SectionLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Item = styled.Pressable<{ $active?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  /* Sem scroll no drawer, os itens precisam caber inteiros na tela. */
  padding-vertical: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  background-color: ${({ theme, $active }) =>
    $active ? `${theme.colors.accent}1A` : 'transparent'};

  /* A luz so' aparece no item selecionado: e' ela que diz "voce esta' aqui"
     quando o fundo tintado nao basta sobre o card do drawer. */
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ $active }) => ($active ? 0.3 : 0)};
  shadow-radius: 10px;
  elevation: ${({ $active }) => ($active ? 4 : 0)};
`

export const ItemLabel = styled.Text<{ $active?: boolean; $danger?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $active, $danger }) =>
    $danger ? theme.colors.danger : $active ? theme.colors.accentText : theme.colors.text};
`

export const ActiveDot = styled.View`
  margin-left: auto;
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.accent};
`

export const Footer = styled.View<{ $bottomInset: number }>`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  padding-horizontal: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme, $bottomInset }) => $bottomInset + theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`
