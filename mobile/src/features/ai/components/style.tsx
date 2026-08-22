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
  font-size: 15px;
  font-weight: 700;
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

/* -------------------------------- Balao --------------------------------- */

export const BubbleRow = styled.View<{ $mine: boolean }>`
  flex-direction: row;
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`

export const Bubble = styled.View<{ $mine: boolean }>`
  max-width: 82%;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 2}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme, $mine }) => ($mine ? theme.colors.accent : theme.colors.card)};
  border-color: ${({ theme, $mine }) => ($mine ? theme.colors.accent : theme.colors.border)};
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
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
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
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) => theme.colors.border};
`

export const PromptTitle = styled.Text`
  font-size: 13px;
  font-weight: 600;
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
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 6;
`

/* O teto de altura deixa o campo crescer com o texto sem engolir a conversa.
   Sem borda/fundo proprios: quem desenha o contorno agora e' o Composer, o
   input vive "dentro" dele junto do toggle e do botao de enviar. */
export const ComposerInput = styled.TextInput`
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
`

export const SendButton = styled.Pressable<{ $enabled: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent};
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.5)};
`

/* --------------------------------- Aviso --------------------------------- */

export const Banner = styled.View<{ $tint: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ $tint }) => `${$tint}22`};
`

export const BannerText = styled.Text<{ $tint: string }>`
  flex: 1;
  font-size: 12px;
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
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-color: ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => `${theme.colors.accent}18`};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
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
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme, $active }) => ($active ? `${theme.colors.accent}14` : theme.colors.card)};
  border-color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
`

export const MenuOptionIcon = styled.View<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.accent : `${theme.colors.accent}18`)};
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
