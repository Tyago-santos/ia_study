import 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NotificationHost } from '@/shared/components/ui/NotificationHost'
import { useAuthStore } from '@/shared/store/auth'
import { AppThemeProvider } from '@/shared/styles'
import { useTheme } from '@/shared/hooks/useTheme'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

export default function RootLayout() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const { theme, colors } = useTheme()

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync()
    }
  }, [hasHydrated])

  // Pinta a root view nativa com a cor do tema: garante que nenhuma area
  // (inclusive atras das barras do sistema) fique branca no edge-to-edge.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg)
  }, [colors.bg])

  if (!hasHydrated) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
              {/* O ThemeProvider do expo-router so pinta o chrome da navegacao;
                  este aqui e o que alimenta os styled components das telas. */}
              <AppThemeProvider>
                <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(app)" />
                </Stack>
                {/* Fica fora do Stack para sobrepor qualquer tela. */}
                <NotificationHost />
              </AppThemeProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}
