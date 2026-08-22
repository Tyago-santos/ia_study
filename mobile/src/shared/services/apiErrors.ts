/**
 * Erros do cliente HTTP, num modulo sem dependencias.
 *
 * Vivem separados de `api.ts` porque quem precisa distinguir os dois casos
 * (`offlineFirst`, telas) nao pode importar `api.ts`: ele mesmo importa a
 * limpeza de dados do logout, que importa `offlineFirst` — e o ciclo deixaria
 * uma das classes indefinida na hora do `instanceof`.
 */

/** O servidor respondeu, mas com erro. `status` diz se foi regra ou falha dele. */
export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Nem chegou a responder: sem rede, servidor fora do ar ou tempo esgotado. */
export class OfflineError extends Error {
  constructor() {
    super('Servidor indisponível')
    this.name = 'OfflineError'
  }
}
