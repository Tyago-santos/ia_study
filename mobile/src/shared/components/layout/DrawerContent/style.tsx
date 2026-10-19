import { Pressable } from 'react-native'
import { LOGO_BACKDROP } from '@/shared/constants/branding'
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

export const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
`

export const LogoText = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentText};
`

export const Menu = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`

/* Sombra fica no wrapper (nao no botao com overflow:hidden), senao o corte
   das bordas arredondadas some com a sombra junto. */
export const AiItemShadow = styled.View`
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-opacity: 0.35;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 6;
`

/* Mesmo `accent` solido usado nos botoes primarios do app (Button/style.tsx),
   pra manter o mesmo tom de verde em vez de uma cor propria so' deste item. */
export const AiItem = styled(Pressable)<{ $active: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.accent};
  border-width: ${({ $active }) => ($active ? '2px' : '0px')};
  border-color: #ffffff;
`

export const AiIconBadge = styled.View`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff33;
`

export const AiTextGroup = styled.View`
  flex: 1;
`

/* Cor fixa em branco (nao `onAccent`): no tema escuro esse token e quase
   preto, o que sumia com o texto em cima do verde. */
export const AiLabel = styled.Text`
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #ffffff;
`

export const AiSubLabel = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: #ffffffcc;
`

export const AiPulseWrap = styled.View`
  width: 8px;
  height: 8px;
  align-items: center;
  justify-content: center;
`

export const AiPulseRing = styled.View`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: #ffffffb3;
`

export const AiPulseDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: #ffffff;
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
