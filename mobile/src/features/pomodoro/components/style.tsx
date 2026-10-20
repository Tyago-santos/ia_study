import { styled } from '@/shared/styles'

export const Card = styled.View<{ $accent: string }>`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ $accent }) => `${$accent}44`};

  /* O halo usa o acento do modo (focus/rest) e nao o indigo da marca: o
     widget e' a unica peca que muda de cor conforme o timer, entao a luz
     e' o que avisa qual modo esta' ativo antes de ler o rotulo. */
  shadow-color: ${({ $accent }) => $accent};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.3;
  shadow-radius: 16px;
  elevation: 4;
`

export const MainRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const IconBadge = styled.View<{ $accent: string }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $accent }) => `${$accent}22`};
  border-width: 1px;
  border-color: ${({ $accent }) => `${$accent}33`};
`

export const Info = styled.View`
  flex: 1;
`

/* `tabular-nums` trava a largura dos digitos: sem isso o relogio treme a cada
   segundo, porque "1" e mais estreito que "8". */
export const Time = styled.Text`
  font-size: 20px;
  font-weight: 700;
  font-variant: tabular-nums;
  color: ${({ theme }) => theme.colors.text};
`

export const Meta = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const PlayButton = styled.Pressable<{ $accent: string; $blocked: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $accent }) => $accent};
  opacity: ${({ $blocked }) => ($blocked ? 0.4 : 1)};

  /* Unico ponto realmente solido da tela: o halo e' o que faz o play parecer
     "clicavel" antes do dedo chegar. */
  shadow-color: ${({ $accent }) => $accent};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.45;
  shadow-radius: 10px;
  elevation: 5;
`

export const Warning = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.warning};
`

export const Panel = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-top: ${({ theme }) => theme.spacing.xs}px;
`

export const PanelLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const ModeRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const ModeOption = styled.Pressable<{ $color: string; $active: boolean }>`
  flex: 1;
  align-items: center;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm - 2}px;
  background-color: ${({ $color, $active }) => ($active ? `${$color}22` : 'transparent')};
  border-color: ${({ theme, $color, $active }) => ($active ? $color : theme.colors.border)};
`

export const ModeLabel = styled.Text<{ $color: string; $active: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme, $color, $active }) => ($active ? $color : theme.colors.textSecondary)};
`

/** Mesma geometria do `Input` compartilhado (fundo tintado, sem contorno
 *  fechado): aqui era o unico campo do app com borda dura. */
export const PhraseInput = styled.TextInput`
  outline-style: none;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.06)' : theme.colors.border};
`

export const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.xs}px;
`

export const ToggleLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`
