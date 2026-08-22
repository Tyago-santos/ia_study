import { styled } from '@/shared/styles'

export const Track = styled.View<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
`

export const Fill = styled.View<{ $pct: number; $height: number; $color: string }>`
  width: ${({ $pct }) => $pct}%;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ $color }) => $color};
`
