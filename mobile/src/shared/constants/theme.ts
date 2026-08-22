/**
 * Paleta unica dos tres temas.
 *
 * A identidade continua verde, mas fora do neon: verde saturado ao maximo sobre
 * preto puro brilha ("halation") e cansa em sessao longa de estudo, que e o uso
 * real do app. Por isso o escuro parte de um cinza-azulado e o verde vem
 * rebaixado, com texto secundario neutro em vez de esverdeado.
 *
 * Todos os pares texto/fundo daqui ficam acima de 4.5:1 (WCAG AA), inclusive
 * `onAccent` sobre `accent`, que e o caso dos botoes primarios.
 */
export const Colors = {
  light: {
    // Fundo um passo mais frio que o branco do card: a borda do card aparece
    // por tom, nao por linha, e a tela fica menos "cinza claro chapado".
    bg: '#f3f6fa',
    bgSecondary: '#e9eff5',
    text: '#16202d',
    textSecondary: '#515f70',
    border: '#dbe3ec',
    card: '#ffffff',
    accent: '#15803d',
    accentText: '#146b33',
    onAccent: '#ffffff',
    danger: '#c62f2f',
    warning: '#a45c07',
  },
  dark: {
    // Escala de cinza-azulado em degraus maiores que a de antes: fundo quase
    // preto, card visivelmente elevado e borda so' sugerindo o limite — e' o
    // que da profundidade sem voltar ao contorno aceso.
    bg: '#0a0e13',
    bgSecondary: '#111821',
    card: '#171f2a',
    border: '#253041',
    text: '#e3e9f0',
    textSecondary: '#95a3b2',
    accent: '#3fb950',
    accentText: '#56d364',
    onAccent: '#08110c',
    danger: '#ff7b72',
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
    accent: '#9a6b12',
    accentText: '#14622f',
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
 */
export const Tints = {
  green: '#2fa35c',
  emerald: '#22a06b',
  amber: '#d08a1e',
  red: '#e05a52',
  // Um passo mais claros que o padrao: aparecem sobre card escuro e sobre o
  // papel ambar sem sumir, que e onde eles realmente aparecem.
  cyan: '#2596be',
  violet: '#907fe8',
} as const

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const
