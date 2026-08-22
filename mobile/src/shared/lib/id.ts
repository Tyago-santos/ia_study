/**
 * Identificador local de um registro.
 *
 * O contador sequencial de antes reiniciava do zero a cada abertura do app —
 * inofensivo enquanto os dados morriam junto, colisao garantida agora que eles
 * ficam gravados. Tempo + aleatorio da um id unico entre sessoes.
 */
export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
