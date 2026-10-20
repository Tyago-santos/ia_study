import { styled } from '@/shared/styles'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

/**
 * Botao.
 *
 * O primario e' a peca de assinatura do tema: fundo indigo com gradiente ate'
 * o violeta por cima (camada decorativa, ve `Gradient`) e um halo do proprio
 * indigo embaixo, que e' o equivalente ao `box-shadow` luminoso do Stitch.
 * O halo vem do lado de fora do botao, entao `overflow: hidden` so' serve pra
 * recortar o gradiente no raio de canto — ele nao engole a luz.
 */
export const Container = styled.Pressable<{ $variant: ButtonVariant; $disabled?: boolean }>`
  outline-style: none;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;

  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.accent : $variant === 'danger' ? theme.colors.danger : 'transparent'};
  border-color: ${({ theme, $variant }) =>
    $variant === 'primary'
      ? 'transparent'
      : $variant === 'danger'
        ? theme.colors.danger
        : theme.colors.border};

  shadow-color: ${({ theme, $variant }) =>
    $variant === 'danger' ? theme.colors.danger : theme.colors.accent};
  shadow-offset: 0px 8px;
  shadow-opacity: ${({ $disabled, $variant }) =>
    $disabled || $variant === 'secondary' ? 0 : 0.4};
  shadow-radius: 16px;
  elevation: ${({ $disabled }) => ($disabled ? 0 : 6)};

  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

/**
 * Fica acima da camada de gradiente (que e' absoluta e entra antes no DOM),
 * e ganha `z-index` para nao ser coberta em Android.
 */
export const Label = styled.Text<{ $variant: ButtonVariant }>`
  position: relative;
  z-index: 1;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: ${({ theme, $variant }) =>
    /* Fundo solido (primary/danger) sempre pede texto claro, independente do
       tema — accentText so contrasta bem sobre fundo transparente. */
    $variant === 'secondary' ? theme.colors.accentText : theme.colors.onAccent};
`
