import { styled } from '@/shared/styles'

export const Card = styled.View<{ $accent: string }>`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ $accent }) => `${$accent}44`};
`

export const MainRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const IconBadge = styled.View<{ $accent: string }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $accent }) => `${$accent}22`};
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
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm - 2}px;
  background-color: ${({ $color, $active }) => ($active ? `${$color}22` : 'transparent')};
  border-color: ${({ theme, $color, $active }) => ($active ? $color : theme.colors.border)};
`

export const ModeLabel = styled.Text<{ $color: string; $active: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme, $color, $active }) => ($active ? $color : theme.colors.textSecondary)};
`

export const PhraseInput = styled.TextInput`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-color: ${({ theme }) => theme.colors.border};
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
