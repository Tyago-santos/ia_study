import 'styled-components/native'
import type { AppTheme } from './theme'

/**
 * Tipa `theme` dentro de todo styled component, nos dois specifiers: o codigo
 * importa de `styled-components/native`, mas a interface original mora no
 * pacote raiz e alguns tipos internos a resolvem por la.
 */
declare module 'styled-components/native' {
  export interface DefaultTheme extends AppTheme {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
