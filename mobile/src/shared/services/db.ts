/**
 * Banco local do app.
 *
 * As telas liam um objeto em memoria semeado com dados ficticios: o que o
 * usuario criasse sumia ao fechar o app. O mesmo formato agora vive no
 * AsyncStorage — o app comeca vazio e o que entra fica.
 *
 * Tudo passa por `read`/`write` para que exista um unico ponto de leitura do
 * disco (a copia em memoria e o cache) e um unico ponto de gravacao.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import type {
  Activity,
  Conversation,
  Flashcard,
  MindMap,
  Quiz,
  ReferenceFile,
  ScheduleEvent,
  StudySession,
  Subject,
  Summary,
  Topic,
} from '@/shared/types'

const STORAGE_KEY = 'gnosis:database:v1'

export interface AppSettings {
  fontSize: 'small' | 'medium' | 'large'
  language: string
  notifications: boolean
}

/** A materia fica junto da atividade para o dashboard colorir a linha. */
export type StoredActivity = Activity & { subjectId: string }

export interface Database {
  subjects: Subject[]
  topics: Topic[]
  sessions: StudySession[]
  flashcards: Flashcard[]
  quizzes: Quiz[]
  summaries: Summary[]
  mindMaps: MindMap[]
  events: ScheduleEvent[]
  conversations: Conversation[]
  activities: StoredActivity[]
  referenceFiles: ReferenceFile[]
  settings: AppSettings
}

function emptyDatabase(): Database {
  return {
    subjects: [],
    topics: [],
    sessions: [],
    flashcards: [],
    quizzes: [],
    summaries: [],
    mindMaps: [],
    events: [],
    conversations: [],
    activities: [],
    referenceFiles: [],
    settings: { fontSize: 'medium', language: 'pt-BR', notifications: true },
  }
}

let cache: Database | null = null
let loading: Promise<Database> | null = null

function load(): Promise<Database> {
  if (cache) return Promise.resolve(cache)

  // A promessa fica guardada: varias telas montam juntas e todas chamariam
  // `getItem` ao mesmo tempo, cada uma criando o seu proprio cache.
  loading ??= (async () => {
    let stored: Partial<Database> = {}

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (raw) stored = JSON.parse(raw) as Partial<Database>
    } catch {
      // Disco ilegivel ou JSON corrompido nao pode impedir o app de abrir:
      // o usuario perde o historico, nao o acesso.
    }

    // Mescla com o vazio para que uma gravacao antiga, feita antes de existir
    // alguma colecao, nao chegue nas telas como `undefined`.
    cache = { ...emptyDatabase(), ...stored }
    return cache
  })()

  return loading
}

let writing: Promise<unknown> = Promise.resolve()

/**
 * Gravacoes em fila. Sem a fila, duas mutacoes seguidas viram dois `setItem`
 * concorrentes e a que terminar por ultimo pode ser a que saiu primeiro.
 */
function flush(db: Database): Promise<void> {
  const next = writing
    .catch(() => {})
    .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db)))

  writing = next
  return next
}

export async function read<T>(select: (db: Database) => T): Promise<T> {
  return select(await load())
}

/** Aplica a mutacao e so resolve depois de gravada. */
export async function write<T>(mutate: (db: Database) => T): Promise<T> {
  const db = await load()
  const result = mutate(db)
  await flush(db)
  return result
}

/** Apaga tudo o que foi gravado e volta ao estado de app recem instalado. */
export async function clearDatabase(): Promise<void> {
  cache = emptyDatabase()
  loading = Promise.resolve(cache)
  await flush(cache)
}
