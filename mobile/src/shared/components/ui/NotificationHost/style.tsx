import Animated from 'react-native-reanimated'
import { styled } from '@/shared/styles'

export const Host = styled.View<{ $top: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  z-index: 1000;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const Banner = styled(Animated.View)<{ $tint: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ $tint }) => $tint};
  /* Halo na cor do proprio aviso: sombra preta sumiria no fundo marinho e
     ainda competiria com o tint da borda, que e' a informacao aqui. */
  elevation: 6;
  shadow-color: ${({ $tint }) => $tint};
  shadow-opacity: 0.4;
  shadow-radius: 14px;
  shadow-offset: 0px 4px;
`

export const Content = styled.View`
  flex: 1;
  gap: 1px;
`

export const Title = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Message = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
