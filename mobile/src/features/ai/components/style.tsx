import { StyleSheet } from 'react-native'
import { styled } from '@/shared/styles'

/* ----------------------------- MarkdownText ----------------------------- */

export const Markdown = styled.View`
  gap: 2px;
`

export const Paragraph = styled.Text`
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`

export const Bold = styled.Text`
  font-weight: 700;
`

export const Code = styled.Text`
  font-family: monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accentText};
`

export const Heading = styled.Text`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text};
`

export const ListRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const ListMarker = styled.Text`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentText};
`

export const Spacer = styled.View`
  height: ${({ theme }) => theme.spacing.xs}px;
`

/* `hairlineWidth` e a menor linha visivel do aparelho; 1px viraria um traco
   grosso nas telas de alta densidade. */
export const Rule = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  opacity: 0.4;
  margin-vertical: 2px;
  background-color: ${({ theme }) => theme.colors.textSecondary};
`

export const Table = styled.View`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
  margin-vertical: 2px;
  border-color: ${({ theme }) => theme.colors.border};
`

export const TableRow = styled.View<{ $header?: boolean }>`
  flex-direction: row;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme, $header }) => ($header ? theme.colors.bgSecondary : 'transparent')};
  border-bottom-color: ${({ theme }) => theme.colors.border};
`

export const TableCell = styled.View<{ $align: 'left' | 'center' | 'right' }>`
  min-width: 96px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-right-width: ${StyleSheet.hairlineWidth}px;
  border-right-color: ${({ theme }) => theme.colors.border};
  align-items: ${({ $align }) =>
    $align === 'center' ? 'center' : $align === 'right' ? 'flex-end' : 'flex-start'};
`

export const TableCellText = styled.Text<{ $header?: boolean }>`
  font-size: 13px;
  line-height: 18px;
  font-weight: ${({ $header }) => ($header ? '700' : '400')};
  color: ${({ theme }) => theme.colors.text};
`

/* -------------------------------- Balao --------------------------------- */

export const BubbleRow = styled.View<{ $mine: boolean }>`
  flex-direction: row;
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`

export const Bubble = styled.View<{ $mine: boolean }>`
  max-width: 82%;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 2}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme, $mine }) => ($mine ? theme.colors.accent : theme.colors.card)};
  border-color: ${({ theme, $mine }) =>
    $mine
      ? theme.colors.accent
      : theme.name === 'dark'
        ? 'rgba(255, 255, 255, 0.07)'
        : theme.colors.border};
  /* Halo indigo em vez de sombra preta: a profundidade vem da cor da marca,
     nao de um cinza chapado em cima do card. */
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const BubbleText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.onAccent};
`

export const BubbleTime = styled.Text<{ $mine: boolean }>`
  font-size: 10px;
  align-self: flex-end;
  opacity: 0.7;
  color: ${({ theme, $mine }) => ($mine ? theme.colors.onAccent : theme.colors.textSecondary)};
`

/* ------------------------------ Boas-vindas ------------------------------ */

export const Welcome = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const WelcomeCard = styled.View`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const WelcomeText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`

export const PromptGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

/* `flex-basis: 45%` com `flex-grow` monta duas colunas que se ajustam sozinhas
   ao tamanho da tela, sem media query. */
export const PromptCard = styled.Pressable`
  flex-grow: 1;
  flex-basis: 45%;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.card};
  /* Tinta indigo fraca no fundo: o card "emite" a cor da marca em vez de
     apenas repousar sobre o mesmo branco da tela. */
  border-color: ${({ theme }) => `${theme.colors.accent}33`};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.1 : 0.06)};
  shadow-radius: 10px;
  elevation: 2;
`

export const PromptTitle = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.colors.text};
`

/* -------------------------------- Composer ------------------------------- */

/* Flutua sobre o fundo da tela: margem nos quatro lados + sombra, em vez de
   uma barra colada na borda com fundo solido. */
export const Composer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: -${({ theme }) => theme.spacing.md}px;
  margin-horizontal: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm + 10}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
  /* Halo indigo no lugar da sombra preta: no escuro sombra preta some, e o
     halo reforça a identidade da marca. */
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 8px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.18 : 0.14)};
  shadow-radius: 16px;
  elevation: 6;
`

/* O teto de altura deixa o campo crescer com o texto sem engolir a conversa.
   Sem borda/fundo proprios: quem desenha o contorno agora e' o Composer, o
   input vive "dentro" dele junto do toggle e do botao de enviar. */
export const ComposerInput = styled.TextInput`
  outline-style: none;
  flex: 1;
  max-height: 110px;
  padding-horizontal: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`

export const ComposerMenuButton = styled.Pressable<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $active }) => ($active ? `${theme.colors.accent}22` : 'transparent')};
`

export const MicButton = styled.Pressable<{ $recording: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $recording }) => ($recording ? theme.colors.danger : 'transparent')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  /* Gravando: o botao "pulsa" de vermelho com halo proprio, sinal visivel de
     que o microfone esta' aberto. */
  shadow-color: ${({ theme }) => theme.colors.danger};
  shadow-offset: 0px 0px;
  shadow-opacity: ${({ $recording }) => ($recording ? 0.6 : 0)};
  shadow-radius: 8px;
  elevation: 3;
`

export const SendButton = styled.Pressable<{ $enabled: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent};
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.5)};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.4;
  shadow-radius: 8px;
  elevation: 3;
`

/* --------------------------------- Aviso --------------------------------- */

export const Banner = styled.View<{ $tint: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 2}px;
  background-color: ${({ $tint }) => `${$tint}22`};
  border-top-width: 1px;
  /* Filete na cor do aviso: separa o banner do fundo sem um bloco chapado. */
  border-top-color: ${({ $tint }) => `${$tint}44`};
`

export const BannerText = styled.Text<{ $tint: string }>`
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ $tint }) => $tint};
`

/* ---------------------------- Botao de geracao --------------------------- */

export const GenerateButton = styled.Pressable<{ $disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 2}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-color: ${({ theme }) => `${theme.colors.accent}55`};
  background-color: ${({ theme }) => `${theme.colors.accent}1f`};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.14 : 0.1)};
  shadow-radius: 12px;
  elevation: 2;
`

export const GenerateText = styled.View`
  flex: 1;
  gap: 1px;
`

export const GenerateTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentText};
`

export const GenerateHint = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* -------------------------- Menu do composer ------------------------------ */

export const MenuOption = styled.Pressable<{ $active?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  background-color: ${({ theme, $active }) => ($active ? `${theme.colors.accent}14` : theme.colors.card)};
  border-color: ${({ theme, $active }) =>
    $active ? `${theme.colors.accent}55` : theme.colors.border};
`

/* Ícone circular com glow: mesmo badge dos cards do app, com halo indigo
   para o item ativo saltar da lista. */
export const MenuOptionIcon = styled.View<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.accent : `${theme.colors.accent}22`)};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 0px;
  shadow-opacity: ${({ $active }) => ($active ? 0.35 : 0.15)};
  shadow-radius: 8px;
  elevation: 3;
`

export const MenuOptionText = styled.View`
  flex: 1;
  gap: 2px;
`

export const MenuOptionTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const MenuOptionDescription = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const PickerLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const PickerNote = styled.Text`
  font-size: 12px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* --------------------------- Historico de sessoes ------------------------- */

export const SessionsBackdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.55);
`

export const SessionsBackdropFill = styled.Pressable`
  outline-style: none;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`

export const SessionsSheet = styled.View`
  max-height: 78%;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  /* Cantos xl como o restante dos paineis elevados do app. */
  border-top-left-radius: ${({ theme }) => theme.radius.xl}px;
  border-top-right-radius: ${({ theme }) => theme.radius.xl}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
`

export const SessionsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`

export const SessionsTitle = styled.Text`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.colors.text};
`

export const NewSessionButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-style: dashed;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  /* Tracejado com tinta indigo fraca: destaca sem competir com as sessoes
     reais da lista. */
  border-color: ${({ theme }) => `${theme.colors.accent}55`};
  background-color: ${({ theme }) => `${theme.colors.accent}14`};
`

export const NewSessionText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.colors.accentText};
`

export const SessionsList = styled.ScrollView.attrs(({ theme }) => ({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
}))``

export const SessionRow = styled.Pressable<{ $active: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme, $active }) => ($active ? `${theme.colors.accent}14` : 'transparent')};
  border-color: ${({ theme, $active }) =>
    $active
      ? `${theme.colors.accent}55`
      : theme.name === 'dark'
        ? 'rgba(255, 255, 255, 0.07)'
        : theme.colors.border};
`

export const SessionRowText = styled.View`
  flex: 1;
  gap: 2px;
`

export const SessionRowTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const SessionRowSubtitle = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const SessionRowActions = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const SessionRowIconButton = styled.Pressable`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`

export const SessionsEmpty = styled.Text`
  padding: ${({ theme }) => theme.spacing.lg}px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
