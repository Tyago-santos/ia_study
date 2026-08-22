import AsyncStorage from '@react-native-async-storage/async-storage'
import { ApiError, OfflineError } from '@/shared/services/apiErrors'
import { type Database, read, write } from '@/shared/services/db'

/**
 * Ponte entre o backend e o banco local.
 *
 * O servidor e' a fonte da verdade, mas ele pode estar fora do ar, dormindo
 * (plano free do Render) ou o aparelho sem rede — e nesse caso o app continua
 * usavel com o que ja' foi baixado. Duas regras:
 *
 * - Leitura: busca no servidor e espelha no banco local. Se o servidor nao
 *   responder, devolve o espelho — dados possivelmente velhos, mas presentes.
 * - Escrita: grava no local na hora (a tela responde na hora, mesmo offline) e
 *   manda pro servidor. Se o servidor nao responder, a operacao entra numa
 *   fila e e' reenviada na proxima vez que ele voltar.
 *
 * Erro de rede/servidor cai no local; erro de regra (400, 404, 409...) nao —
 * esse e' o servidor dizendo que a operacao esta errada, e engolir isso
 * deixaria o app mentindo pro usuario.
 */

/** Coleções do banco local que espelham uma tabela do servidor. */
type SyncedKey = 'subjects' | 'topics' | 'flashcards' | 'quizzes'

/** O servidor nao respondeu (rede caiu, dormindo, sobrecarregado). */
export function isServerUnreachable(error: unknown): boolean {
  if (error instanceof OfflineError) return true
  // 5xx e' o servidor com problema, nao o pedido: vale usar o espelho local.
  if (error instanceof ApiError) return error.status >= 500
  return false
}

/**
 * Uma listagem nunca devolve 404 por regra (lista vazia e' `[]`), entao um 404
 * aqui so' pode ser servidor sem essa rota — versao antiga no ar, deploy ainda
 * nao feito. Tratado como indisponivel para o app abrir com o espelho local em
 * vez de estourar erro na tela.
 */
function isMissingRoute(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

/** Busca no servidor, espelha no local; se o servidor sumir, devolve o espelho. */
export async function listThrough<K extends SyncedKey>(
  key: K,
  remote: () => Promise<Database[K]>,
): Promise<Database[K]> {
  try {
    const items = await remote()
    await write((db) => {
      db[key] = items
    })
    return items
  } catch (error) {
    if (!isServerUnreachable(error) && !isMissingRoute(error)) throw error
    return read((db) => db[key])
  }
}

/**
 * Como `listThrough`, mas para um numero agregado (media de quiz, total de
 * flashcards) que nao tem espelho proprio: o fallback recalcula a partir das
 * colecoes que ja estao no banco local.
 */
export async function valueThrough<T>(
  remote: () => Promise<T>,
  local: () => Promise<T>,
): Promise<T> {
  try {
    return await remote()
  } catch (error) {
    if (!isServerUnreachable(error) && !isMissingRoute(error)) throw error
    return local()
  }
}

// ------------------------------------------------------------ fila de sync

const QUEUE_KEY = 'gnosis:syncqueue:v1'

/** Uma escrita que ainda nao chegou ao servidor. */
export interface PendingOp {
  id: string
  key: SyncedKey
  action: 'create' | 'remove' | 'toggle' | 'submit'
  /** id provisorio gerado no aparelho — trocado pelo do servidor ao sincronizar. */
  localId?: string
  payload: unknown
  createdAt: string
}

async function loadQueue(): Promise<PendingOp[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY)
    return raw ? (JSON.parse(raw) as PendingOp[]) : []
  } catch {
    // Fila ilegivel nao pode travar o app: perde-se o que estava pendente.
    return []
  }
}

async function saveQueue(ops: PendingOp[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(ops))
}

async function enqueue(op: Omit<PendingOp, 'id' | 'createdAt'>): Promise<void> {
  const ops = await loadQueue()
  ops.push({ ...op, id: `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() })
  await saveQueue(ops)
}

/** Quantas escritas estao esperando o servidor voltar. */
export async function pendingCount(): Promise<number> {
  return (await loadQueue()).length
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY)
}

// --------------------------------------------------------------- escritas

interface CreateThroughOptions<T extends { id: string }, K extends SyncedKey> {
  key: K
  /** Registro provisorio mostrado na tela enquanto o servidor nao confirma. */
  draft: T
  remote: () => Promise<T>
  /** O que a operacao precisa pra ser refeita depois, se o servidor estiver fora. */
  payload: unknown
  /** Onde o novo entra na lista — a mesma ordem que o servidor devolve. */
  position?: 'start' | 'end'
  /** Roda junto da gravacao local (ex.: registrar na timeline do dashboard). */
  onLocalWrite?: (db: Database, item: T) => void
}

/**
 * Grava local na hora e tenta o servidor. Confirmado, o registro provisorio da'
 * lugar ao do servidor (que traz o id definitivo); sem servidor, a criacao fica
 * na fila e o provisorio segue valendo na tela.
 */
export async function createThrough<T extends { id: string }, K extends SyncedKey>(
  options: CreateThroughOptions<T, K>,
): Promise<T> {
  const { key, draft, remote, payload, position = 'start', onLocalWrite } = options

  await write((db) => {
    const list = db[key] as unknown as T[]
    if (position === 'end') list.push(draft)
    else list.unshift(draft)
    onLocalWrite?.(db, draft)
  })

  try {
    const saved = await remote()

    // Troca o provisorio pelo do servidor, na mesma posicao.
    await write((db) => {
      const list = db[key] as unknown as T[]
      const index = list.findIndex((item) => item.id === draft.id)
      if (index >= 0) list[index] = saved
      else if (position === 'end') list.push(saved)
      else list.unshift(saved)
    })

    return saved
  } catch (error) {
    if (!isServerUnreachable(error)) {
      // Servidor recusou a operacao: desfaz o provisorio pra tela nao mostrar
      // um registro que nunca vai existir.
      await write((db) => {
        const list = db[key] as unknown as T[]
        const index = list.findIndex((item) => item.id === draft.id)
        if (index >= 0) list.splice(index, 1)
      })
      throw error
    }

    await enqueue({ key, action: 'create', localId: draft.id, payload })
    return draft
  }
}

interface MutateThroughOptions<K extends SyncedKey> {
  key: K
  id: string
  action: PendingOp['action']
  /** Muda o banco local. Devolve o que a funcao publica entrega a quem chamou. */
  applyLocal: (db: Database) => void
  remote: () => Promise<unknown>
  payload: unknown
}

/**
 * Remocao/alteracao de um registro que ja existe. Aplica local, tenta o
 * servidor, enfileira se ele estiver fora.
 */
export async function mutateThrough<K extends SyncedKey>(
  options: MutateThroughOptions<K>,
): Promise<void> {
  const { key, id, action, applyLocal, remote, payload } = options

  await write(applyLocal)

  try {
    await remote()
  } catch (error) {
    if (!isServerUnreachable(error)) throw error
    await enqueue({ key, action, localId: id, payload })
  }
}

// ------------------------------------------------------------- drenagem

/** Como refazer cada tipo de operacao pendente contra o servidor. */
export type SyncHandlers = {
  [K in SyncedKey]?: {
    create?: (payload: any) => Promise<{ id: string }>
    remove?: (id: string) => Promise<unknown>
    toggle?: (id: string) => Promise<unknown>
    submit?: (payload: any) => Promise<unknown>
  }
}

let draining = false

/**
 * Reenvia o que ficou pendente, na ordem em que aconteceu.
 *
 * Para uma criacao confirmada, o id provisorio some do banco local e entra o
 * registro do servidor. Uma operacao que o servidor recusa (o registro nao
 * existe mais la', por exemplo) e' descartada em vez de travar a fila para
 * sempre; so' falha de rede faz a drenagem parar e tentar de novo depois.
 */
export async function drainQueue(handlers: SyncHandlers): Promise<number> {
  if (draining) return 0
  draining = true

  try {
    let ops = await loadQueue()
    if (ops.length === 0) return 0

    let synced = 0

    while (ops.length > 0) {
      const op = ops[0]!
      const handler = handlers[op.key]?.[op.action]

      if (!handler) {
        ops.shift()
        continue
      }

      try {
        if (op.action === 'create') {
          const saved = await (handler as (p: unknown) => Promise<{ id: string }>)(op.payload)

          // O provisorio criado offline vira o registro do servidor.
          if (op.localId) {
            await write((db) => {
              const list = db[op.key] as unknown as { id: string }[]
              const index = list.findIndex((item) => item.id === op.localId)
              if (index >= 0) list[index] = saved
            })
          }
        } else if (op.action === 'submit') {
          await (handler as (p: unknown) => Promise<unknown>)(op.payload)
        } else {
          await (handler as (id: string) => Promise<unknown>)(op.localId ?? '')
        }

        synced++
      } catch (error) {
        // Sem rede: para aqui e mantem o resto da fila pra proxima tentativa.
        if (error instanceof OfflineError) break

        // Servidor recusou (registro sumiu, id provisorio que ele nunca viu):
        // insistir nao resolve, entao descarta e segue.
        console.warn('[sync] operação descartada', op.key, op.action, error)
      }

      ops.shift()
      await saveQueue(ops)
    }

    return synced
  } finally {
    draining = false
  }
}
