// ScrollView do gesture-handler, e nao do react-native: o nativo intercepta o
// toque no Android e os gestos de arrastar dentro da tela nunca ativariam.
import { ScrollView } from 'react-native-gesture-handler'
import { styled } from '@/shared/styles'

export const Container = styled.View<{ $centered?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.bg};
  justify-content: ${({ $centered }) => ($centered ? 'center' : 'flex-start')};
`

/**
 * O padding da versao rolavel vive no `contentContainerStyle`, nao no estilo do
 * proprio ScrollView — no `style` ele recortaria o conteudo em vez de espaca-lo.
 */
export const ScrollContainer = styled(ScrollView).attrs<{ $centered?: boolean }>(
  ({ theme, $centered }) => ({
    contentContainerStyle: {
      padding: theme.spacing.lg,
      flexGrow: 1,
      justifyContent: $centered ? ('center' as const) : undefined,
    },
  }),
)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`
