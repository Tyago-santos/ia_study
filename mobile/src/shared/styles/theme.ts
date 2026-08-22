import { Colors, Radius, Spacing, Tints, type ThemeColors } from '@/shared/constants/theme'
import type { Theme } from '@/shared/types'

/** Nomes de cor validos em qualquer tema (`bg`, `text`, `accent`, ...). */
export type ThemeColorName = keyof ThemeColors

/**
 * Paleta ja resolvida para um tema.
 *
 * `Colors` usa `as const`, entao cada tema tem tipos literais diferentes e
 * nenhum e atribuivel ao outro. Alargar para `string` aqui e o que permite as
 * tres paletas caberem no mesmo `AppTheme`.
 */
export type AppThemeColors = Record<ThemeColorName, string>

/**
 * Tema consumido pelo styled-components.
 *
 * As escalas (`spacing`, `radius`, `tints`) sao as mesmas de
 * `constants/theme`, que segue sendo a fonte unica. Aqui elas so entram no
 * objeto do provider para ficarem acessiveis dentro das template strings
 * (`${({ theme }) => theme.spacing.md}px`) sem cada style.tsx importar tudo.
 */
export interface AppTheme {
  name: Theme
  colors: AppThemeColors
  spacing: typeof Spacing
  radius: typeof Radius
  tints: typeof Tints
}

export function buildTheme(name: Theme): AppTheme {
  return {
    name,
    colors: Colors[name],
    spacing: Spacing,
    radius: Radius,
    tints: Tints,
  }
}
