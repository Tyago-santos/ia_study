import type { PropsWithChildren } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Spacing } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean
  centered?: boolean
  /** Telas sem header nativo (ex.: auth) precisam desviar da status bar. */
  safeTop?: boolean
}

/**
 * Tela com scroll que, se houver inputs, rola automaticamente o input focado
 * para acima do teclado em iOS e Android. Em Android com edge-to-edge isso
 * responde bem; em iOS com `behavior="padding"` fica suave.
 *
 * O padding vive no `contentContainerStyle` (e nao no estilo do ScrollView):
 * no `style` ele recortaria o conteudo em vez de espacar.
 */
export function Screen({ children, scroll, centered, safeTop }: ScreenProps) {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()

  if (scroll) {
    return (
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: centered ? 'center' : 'flex-start',
          alignItems: centered ? 'center' : 'stretch',
          paddingHorizontal: Spacing.lg,
          paddingTop: safeTop ? insets.top : undefined,
          paddingBottom: Spacing.xl + insets.bottom,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </KeyboardAwareScrollView>
    )
  }

  return <S.Container $centered={centered}>{children}</S.Container>
}
