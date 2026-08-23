import { styled } from '@/shared/styles'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export const Container = styled.Pressable<{ $variant: ButtonVariant; $disabled?: boolean }>`
  outline-style: none;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.accent : $variant === 'danger' ? theme.colors.danger : 'transparent'};
  border-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.accent : $variant === 'danger' ? theme.colors.danger : theme.colors.border};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

export const Label = styled.Text<{ $variant: ButtonVariant }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, $variant }) =>
    /* Fundo solido (primary/danger) sempre pede texto claro, independente do
       tema — accentText so contrasta bem sobre fundo transparente. */
    $variant === 'secondary' ? theme.colors.accentText : theme.colors.onAccent};
`
