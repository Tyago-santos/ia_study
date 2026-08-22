import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { ThemeProvider } from 'styled-components/native'
import { useThemeStore } from '@/shared/store/theme'
import { buildTheme } from './theme'

/**
 * Liga o tema persistido no zustand ao ThemeProvider do styled-components.
 *
 * O objeto e memoizado por nome do tema: sem isso toda troca de rota geraria
 * um `theme` novo e invalidaria o estilo de todo componente da arvore.
 */
export function AppThemeProvider({ children }: PropsWithChildren) {
  const theme = useThemeStore((s) => s.theme)
  const value = useMemo(() => buildTheme(theme), [theme])

  return <ThemeProvider theme={value}>{children}</ThemeProvider>
}
