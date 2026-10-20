import { styled } from '@/shared/styles'

export const Track = styled.View<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
`

/** Preenchimento de cor unica — usado quando quem chama escolhe a cor. */
export const Fill = styled.View<{ $pct: number; $height: number; $color: string }>`
  width: ${({ $pct }) => $pct}%;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ $color }) => $color};
`

/**
 * Envelope do preenchimento em gradiente: fixa a largura e recorta as faixas
 * no propio raio, para o gradiente nao escapar da barra.
 */
export const GradientFill = styled.View<{ $pct: number; $height: number }>`
  width: ${({ $pct }) => $pct}%;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  overflow: hidden;
`
