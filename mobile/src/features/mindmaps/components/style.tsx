import Animated from 'react-native-reanimated'
import { styled } from '@/shared/styles'
import { NODE_HEIGHT, NODE_WIDTH } from '../libs/layout'

/* ------------------------------- Canvas --------------------------------- */

export const Viewport = styled.View`
  flex: 1;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
`

/* A transformacao de pan/zoom chega pelo `style`, vinda do worklet do gesto. */
export const Canvas = styled(Animated.View)`
  position: absolute;
`

/**
 * Sem `react-native-svg` cada aresta e uma View fina rotacionada; a posicao e o
 * angulo sao calculados em `libs/layout` e entram pelo `style`.
 */
export const Edge = styled.View<{ $accent: string }>`
  position: absolute;
  height: 2px;
  border-radius: 1px;
  background-color: ${({ $accent }) => `${$accent}66`};
`

/* ------------------------- Seletor de cor do no ------------------------- */

export const ColorLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const ColorRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const ColorDot = styled.Pressable<{ $color: string; $selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color, theme }) => ($color === 'none' ? 'transparent' : $color)};
  border-width: 2px;
  border-color: ${({ theme, $color }) =>
    $color === 'none' ? theme.colors.textSecondary : 'transparent'};
`

/* Anel interno do dot selecionado: aparece sobre qualquer cor de fundo. */
export const ColorDotRing = styled.View<{ $visible: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 2.5px;
  border-color: #ffffff;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`

export const ColorDotLabel = styled.Text`
  font-size: 9px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Node = styled.Pressable<{
  $accent: string
  $color?: string | null
  $root: boolean
  $selected: boolean
}>`
  position: absolute;
  width: ${NODE_WIDTH}px;
  min-height: ${NODE_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: 10px;
  padding-vertical: 8px;
  padding-left: ${({ $root, $color }) => ($root || $color ? '16px' : '10px')};
  justify-content: center;
  background-color: ${({ theme, $accent, $color, $root }) =>
    $root
      ? $accent
      : $color
        ? `${$color}1f`
        : theme.colors.card};
  border-width: ${({ $selected }) => ($selected ? '2px' : '1px')};
  border-color: ${({ theme, $accent, $color, $root, $selected }) =>
    $selected
      ? theme.colors.text
      : $root
        ? $accent
        : $color
          ? `${$color}aa`
          : `${$accent}66`};
  shadow-color: #000;
  shadow-opacity: 0.18;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`

/* Barra lateral na cor do no: marca a cor mesmo com fundo quase do card. */
export const NodeBar = styled.View<{ $color: string }>`
  position: absolute;
  left: 5px;
  top: 20%;
  bottom: 20%;
  width: 3px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`

export const NodeLabel = styled.Text<{ $root: boolean }>`
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme, $root }) => ($root ? theme.colors.onAccent : theme.colors.text)};
  font-weight: ${({ $root }) => ($root ? 700 : 500)};
`

/* Marca discreta de que o topico tem resumo guardado. */
export const NoteDot = styled.View<{ $accent: string }>`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 5px;
  height: 5px;
  border-radius: 3px;
  background-color: ${({ $accent }) => $accent};
`

/* ------------------------------- Editor --------------------------------- */

export const Editor = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`

export const EditorHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`

export const EditorTitleBlock = styled.View`
  flex: 1;
  gap: 2px;
`

export const EditorTitle = styled.Text`
  font-size: 19px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const EditorMeta = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------- Painel do topico ------------------------------ */

export const Panel = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const PanelHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const PanelAccent = styled.View<{ $accent: string }>`
  width: 3px;
  height: 18px;
  border-radius: 2px;
  background-color: ${({ $accent }) => $accent};
`

export const SelectedLabel = styled.Text`
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

/* Teto de altura: o resumo pode ser longo e nao pode empurrar o canvas. */
export const NoteScroll = styled.ScrollView.attrs({ nestedScrollEnabled: true })`
  max-height: 96px;
`

export const Note = styled.Text`
  font-size: 13px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const NotePlaceholder = styled.Text`
  font-size: 13px;
  font-style: italic;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const PanelActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const PanelButton = styled.Pressable<{ $accent?: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ $accent }) => $accent ?? 'transparent'};
  border-width: ${({ $accent }) => ($accent ? '0px' : '1px')};
  border-color: ${({ theme }) => theme.colors.border};
`

export const PanelButtonLabel = styled.Text<{ $onAccent?: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme, $onAccent }) => ($onAccent ? theme.colors.onAccent : theme.colors.text)};
`

export const ToolbarHint = styled.Text`
  flex: 1;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------------ Listagem -------------------------------- */

export const MapCard = styled.Pressable`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const MapIcon = styled.View<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
`

export const MapInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const MapTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const MapDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const MapMeta = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
