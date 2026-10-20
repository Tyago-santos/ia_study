import Animated from 'react-native-reanimated'
import { styled } from '@/shared/styles'
import { NODE_HEIGHT, NODE_WIDTH } from '../libs/layout'

/* ------------------------------- Canvas --------------------------------- */

/* A area de desenho e' um painel: raio 20 e borda baixa no escuro, para o
   canvas se separar do fundo da tela sem um contorno aceso em volta. */
export const Viewport = styled.View`
  flex: 1;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
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

/* Rotulo no mesmo formato do input compartilhado:13/600 + tracking, secundário
   — o campo abaixo e' uma fileira de cores, entao o rotulo nao disputa. */
export const ColorLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const ColorRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

/* Glow so' no dot escolhido: com bolhas de cor lado a lado o anel branco
   interna some contra fundos claros, e o halo resolve a selecao em qualquer
   um dos tres temas. */
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

  shadow-color: ${({ $color }) => ($color === 'none' ? 'transparent' : $color)};
  shadow-offset: 0px 3px;
  shadow-opacity: ${({ $selected, $color }) => ($selected && $color !== 'none' ? 0.35 : 0)};
  shadow-radius: 8px;
  elevation: ${({ $selected }) => ($selected ? 3 : 0)};
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

/* No' com raio de painel e halo na cor da materia (nao sombra preta): no
   escuro a sombra preta some e os nos pareciam colados no canvas. */
export const Node = styled.Pressable<{
  $accent: string
  $color?: string | null
  $root: boolean
  $selected: boolean
}>`
  position: absolute;
  width: ${NODE_WIDTH}px;
  min-height: ${NODE_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
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
  shadow-color: ${({ $accent }) => $accent};
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.3 : 0.2)};
  shadow-radius: 10px;
  elevation: 3;
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
  border-bottom-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`

export const EditorTitleBlock = styled.View`
  flex: 1;
  gap: 2px;
`

/* Titulo da tela de edicao no mesmo registro dos titulos grandes do app:
   24/800 com tracking negativo — e' o unico texto de primeiro nivel aqui. */
export const EditorTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: ${({ theme }) => theme.colors.text};
`

export const EditorMeta = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------- Painel do topico ------------------------------ */

/* O painel de ferramenta e' uma superfície propria: fundo card sobre o bg da
   tela separa o topo (canvas) da base sem precisar de uma barra cinza. */
export const Panel = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
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
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
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

/* Botao de acao com raio de botao (16) do app; o de fundo acento ganha o halo
   proprio da cor, que e' o que distingue a acao principal da secundaria. */
export const PanelButton = styled.Pressable<{ $accent?: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ $accent }) => $accent ?? 'transparent'};
  border-width: ${({ $accent }) => ($accent ? '0px' : '1px')};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.colors.border};

  shadow-color: ${({ $accent, theme }) => $accent ?? theme.colors.accent};
  shadow-offset: 0px 3px;
  shadow-opacity: ${({ $accent }) => ($accent ? 0.35 : 0)};
  shadow-radius: 8px;
  elevation: ${({ $accent }) => ($accent ? 3 : 0)};
`

export const PanelButtonLabel = styled.Text<{ $onAccent?: boolean }>`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: ${({ theme, $onAccent }) => ($onAccent ? theme.colors.onAccent : theme.colors.text)};
`

export const ToolbarHint = styled.Text`
  flex: 1;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------------ Listagem -------------------------------- */

/* Card de lista na mesma geometria dos demais paineis do app: raio 20, borda
   baixa no escuro e halo indigo no lugar de sombra preta. */
export const MapCard = styled.Pressable`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

/* Badge circular com anel e glow na cor da materia: mesmo tratamento dos
   tiles — e' o ponto de cor que identifica o card na varredura da lista. */
export const MapIcon = styled.View<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
  border-width: 1px;
  border-color: ${({ $color }) => `${$color}33`};

  shadow-color: ${({ $color }) => $color};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  elevation: 3;
`

export const MapInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

/* Titulo de secao:16/700 com tracking negativo, igual aos demais cards. */
export const MapTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.colors.text};
`

export const MapDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* Meta vira label (11/700 + tracking): no corpo 11 regular as letras grudavam
   e a linha de dados parecia ruído em vez de informação. */
export const MapMeta = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
