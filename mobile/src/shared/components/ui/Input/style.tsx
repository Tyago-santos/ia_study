import { styled } from '@/shared/styles'

export const Wrapper = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/**
 * Campo preenchido em vez de contornado.
 *
 * O Stitch (e a referencia do login) usa fundo tintado com borda quase
 * inexistente: sobre o marinho, um contorno fechado em volta do input competia
 * com o botao. Aqui o limite do campo vem do proprio tom `bgSecondary`, e a
 * borda sobe so' quando ha' erro — e' a unica hora em que precisa gritar.
 *
 * `bgSecondary` e' o mesmo token do fundo de secao nos tres temas, entao o
 * campo continua visivel no claro e no papel ambar.
 */
export const Field = styled.TextInput<{ $hasError?: boolean }>`
  outline-style: none;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 6}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-color: ${({ theme, $hasError }) =>
    $hasError
      ? theme.colors.danger
      : theme.name === 'dark'
        ? 'rgba(255, 255, 255, 0.06)'
        : theme.colors.border};
`

export const ErrorText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`
