/**
 * Iniciais para o avatar. So os dois primeiros nomes entram: com nome completo
 * longo o circulo nao comporta mais que isso.
 */
export function initialsOf(name: string | undefined): string {
  return (name ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
