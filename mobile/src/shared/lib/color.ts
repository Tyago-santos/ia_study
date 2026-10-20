/**
 * Interpolacao de cor em hex, para simular gradiente sem lib nativa.
 *
 * O app publica por OTA (`eas update`), entao qualquer coisa que exija
 * recompilar codigo nativo — `expo-linear-gradient`, `expo-blur` — nao chega
 * no aparelho sem um APK novo. Gradiente feito em JS puro vai junto com o
 * bundle do update, entao e' o caminho que mantem o fluxo de entrega.
 *
 * Aceita `#rgb` e `#rrggbb`; retorna `#rrggbb`.
 */
export function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t)
  const ca = toRgb(a)
  const cb = toRgb(b)

  const r = Math.round(ca[0] + (cb[0] - ca[0]) * k)
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * k)
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * k)

  return `#${hex2(r)}${hex2(g)}${hex2(bl)}`
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  return n < 0 ? 0 : n > 1 ? 1 : n
}

function hex2(n: number): string {
  return n.toString(16).padStart(2, '0')
}

function toRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim()

  if (clean.length === 3) {
    const r = clean[0]!
    const g = clean[1]!
    const b = clean[2]!
    return [
      parseInt(r + r, 16),
      parseInt(g + g, 16),
      parseInt(b + b, 16),
    ]
  }

  if (clean.length !== 6) return [0, 0, 0]

  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}
