/**
 * Paleta unica dos tres temas — Cognitive Flow.
 *
 * Identidade indigo (#4F46E5) + cyan (#4CD7F6), a mesma do app web, para o
 * usuario reconhecer o produto ao alternar de dispositivo. O escuro parte de
 * um azul-marinho (#0b1326) em vez de preto puro: sobre indigo saturado, preto
 * gera "halation" e cansa em sessao longa de estudo, que e' o uso real do app.
 *
 * Todos os pares texto/fundo daqui ficam acima de 4.5:1 (WCAG AA), inclusive
 * `onAccent` sobre `accent`, que e' o caso dos botoes primarios.
 */
export const Colors = {
  light: {
    // Fundo um passo mais frio que o branco do card: a borda do card aparece
    // por tom, nao por linha, e a tela fica menos "cinza claro chapado".
    bg: '#f6f7fc',
    bgSecondary: '#eceffb',
    text: '#171f33',
    textSecondary: '#5b6379',
    border: '#dfe3f2',
    card: '#ffffff',
    accent: '#4f46e5',
    accentText: '#4338ca',
    onAccent: '#ffffff',
    danger: '#c62f2f',
    warning: '#a45c07',
  },
  dark: {
    // Escala de azul-marinho em degraus: fundo quase preto, card visivelmente
    // elevado e borda so' sugerindo o limite — e' o que da profundidade sem
    // voltar ao contorno aceso.
    bg: '#0b1326',
    bgSecondary: '#131b2e',
    card: '#171f33',
    border: '#2d3449',
    text: '#dae2fd',
    textSecondary: '#a8b0c9',
    accent: '#4f46e5',
    accentText: '#c3c0ff',
    onAccent: '#ffffff',
    danger: '#ff8a80',
    warning: '#e3b341',
  },
  // Papel ambar: luminancia proxima do branco, entao o texto de acento repete
  // os valores do tema claro para manter o mesmo contraste.
  reading: {
    bg: '#f8f2e3',
    bgSecondary: '#f0e7d2',
    text: '#37301f',
    textSecondary: '#685e4e',
    border: '#e1d4b8',
    card: '#fffdf8',
    accent: '#4f46e5',
    accentText: '#4338ca',
    onAccent: '#fffdf8',
    danger: '#c62f2f',
    warning: '#a45c07',
  },
} as const

export type ThemeColors = typeof Colors.light

/**
 * Cores categoricas (materias, tipos de evento, dificuldade, badges de stat).
 *
 * Sao as mesmas nos tres temas — dai os tons medios: claros demais somem no
 * papel, escuros demais somem no escuro. Ficam sempre em area pequena (icone
 * dentro de badge, pontinho, barra), nunca como fundo de texto corrido.
 *
 * A identidade mudou de verde para indigo, entao as chaves `green`/`emerald`
 * viraram `indigo`/`sky` — os chamadores foram atualizados junto.
 */
export const Tints = {
  indigo: '#4f46e5',
  violet: '#8b5cf6',
  amber: '#d08a1e',
  red: '#e05a52',
  // Um passo mais claros que o padrao: aparecem sobre card escuro e sobre o
  // papel ambar sem sumir, que e' onde eles realmente aparecem.
  cyan: '#2596be',
  sky: '#06b6d4',
} as const

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const

/** Mesmos raios do app web (rounded-xl = 12, rounded-2xl = 16, 3xl = 24). */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const
