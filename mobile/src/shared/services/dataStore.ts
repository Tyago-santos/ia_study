/**
 * Camada de dados do app mobile.
 *
 * O backend ainda nao tem rotas para a maior parte das telas (hoje existem
 * apenas auth, usuarios e o comeco de mapas mentais e resumos), entao tudo e
 * lido e gravado no banco local. As funcoes sao assincronas de proposito:
 * quando o backend existir, basta trocar o corpo delas por chamadas ao `api`
 * sem mexer nas telas nem nos hooks.
 *
 * Nada aqui vem semeado: o app abre vazio e cresce com o uso.
 */
import { createId } from '@/shared/lib/id'
import { read, write } from '@/shared/services/db'
import { studySessionsApi } from '@/shared/services/studySessionsApi'
import type {
  ChatMessage,
  Conversation,
  DailyStats,
  Flashcard,
  MindMap,
  MindMapNode,
  Quiz,
  ReferenceFile,
  ScheduleEvent,
  StudySession,
  Subject,
  SubjectStats,
  Summary,
  Topic,
} from '@/shared/types'
import type { Database, StoredActivity } from '@/shared/services/db'

const now = () => new Date().toISOString()

/**
 * Registra o feito na timeline do dashboard. A lista fica limitada porque ela
 * so e exibida em pedacos de seis itens: guardar tudo faria o JSON gravado
 * crescer para sempre sem que ninguem visse a diferenca.
 */
const ACTIVITY_LIMIT = 50

function pushActivity(db: Database, activity: Omit<StoredActivity, 'id' | 'createdAt'>) {
  db.activities = [
    { id: createId('a'), createdAt: now(), ...activity },
    ...db.activities,
  ].slice(0, ACTIVITY_LIMIT)
}

// ------------------------------------------------------ materias e topicos

export const subjectsService = {
  list: () => read((db) => db.subjects),
  create: (input: { name: string; color: string; icon?: string }) =>
    write((db) => {
      const subject: Subject = { id: createId('s'), createdAt: now(), ...input }
      db.subjects = [...db.subjects, subject]
      return subject
    }),
  remove: (id: string) =>
    write((db) => {
      db.subjects = db.subjects.filter((s) => s.id !== id)
      db.topics = db.topics.filter((t) => t.subjectId !== id)
      return id
    }),
}

export const topicsService = {
  list: () => read((db) => db.topics),
  create: (input: { subjectId: string; name: string }) =>
    write((db) => {
      const topic: Topic = { id: createId('t'), completed: false, createdAt: now(), ...input }
      db.topics = [...db.topics, topic]
      return topic
    }),
  toggle: (id: string) =>
    write((db) => {
      db.topics = db.topics.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      return db.topics.find((t) => t.id === id)!
    }),
  remove: (id: string) =>
    write((db) => {
      db.topics = db.topics.filter((t) => t.id !== id)
      return id
    }),
}

// -------------------------------------------------------------- flashcards

export const flashcardsService = {
  list: (subjectId?: string) =>
    read((db) => (subjectId ? db.flashcards.filter((f) => f.subjectId === subjectId) : db.flashcards)),
  create: (input: {
    subjectId: string
    front: string
    back: string
    difficulty: Flashcard['difficulty']
  }) =>
    write((db) => {
      const flashcard: Flashcard = {
        id: createId('fc'),
        nextReview: now(),
        reviewCount: 0,
        createdAt: now(),
        ...input,
      }
      db.flashcards = [flashcard, ...db.flashcards]

      const subjectName = db.subjects.find((s) => s.id === input.subjectId)?.name ?? 'Estudo'
      pushActivity(db, {
        type: 'flashcard',
        title: 'Novo flashcard',
        description: `${subjectName} - ${input.front}`,
        subjectId: input.subjectId,
      })

      return flashcard
    }),
  remove: (id: string) =>
    write((db) => {
      db.flashcards = db.flashcards.filter((f) => f.id !== id)
      return id
    }),
}

// -------------------------------------------------------------------- quiz

export const quizService = {
  list: (subjectId?: string) =>
    read((db) => (subjectId ? db.quizzes.filter((q) => q.subjectId === subjectId) : db.quizzes)),
  create: (input: { subjectId: string; title: string; questions: Quiz['questions'] }) =>
    write((db) => {
      const quiz: Quiz = { id: createId('q'), createdAt: now(), ...input }
      db.quizzes = [quiz, ...db.quizzes]
      return quiz
    }),
  remove: (id: string) =>
    write((db) => {
      db.quizzes = db.quizzes.filter((q) => q.id !== id)
      return id
    }),
  submit: (input: { quizId: string; answers: Record<string, number> }) =>
    write((db) => {
      const quiz = db.quizzes.find((q) => q.id === input.quizId)
      if (!quiz) throw new Error('Quiz não encontrado')

      const questions = quiz.questions.map((q) => ({ ...q, userAnswer: input.answers[q.id] }))
      const correct = questions.filter((q) => q.userAnswer === q.correctAnswer).length
      const score = Math.round((correct / questions.length) * 100)

      const updated: Quiz = { ...quiz, questions, score, completedAt: now() }
      db.quizzes = db.quizzes.map((q) => (q.id === quiz.id ? updated : q))

      pushActivity(db, {
        type: 'quiz',
        title: quiz.title,
        description: `Score: ${score}%`,
        subjectId: quiz.subjectId,
      })

      return { score, correct, total: questions.length }
    }),
}

// ----------------------------------------------------------------- resumos

export const summariesService = {
  list: () => read((db) => db.summaries),
  create: (input: {
    subjectId: string
    title: string
    content: string
    sourceType: Summary['sourceType']
  }) =>
    write((db) => {
      const summary: Summary = { id: createId('r'), createdAt: now(), ...input }
      db.summaries = [summary, ...db.summaries]

      pushActivity(db, {
        type: 'summary',
        title: `Resumo: ${input.title}`,
        description: 'Resumo criado',
        subjectId: input.subjectId,
      })

      return summary
    }),
  remove: (id: string) =>
    write((db) => {
      db.summaries = db.summaries.filter((s) => s.id !== id)
      return id
    }),
}

// ----------------------------------------------------------- mapas mentais

export const mindMapsService = {
  list: () => read((db) => db.mindMaps),
  create: (input: { subjectId: string; title: string; description?: string }) =>
    write((db) => {
      const rootId = createId('mmn')
      const mindMap: MindMap = {
        id: createId('mm'),
        createdAt: now(),
        updatedAt: now(),
        nodes: [{ id: rootId, parentId: null, label: input.title }],
        ...input,
      }
      db.mindMaps = [mindMap, ...db.mindMaps]
      return mindMap
    }),
  remove: (id: string) =>
    write((db) => {
      db.mindMaps = db.mindMaps.filter((m) => m.id !== id)
      return id
    }),
  addNode: (input: {
    mapId: string
    parentId: string
    label: string
    note?: string
    color?: string
  }) =>
    write((db) => {
      const node: MindMapNode = {
        id: createId('mmn'),
        parentId: input.parentId,
        label: input.label,
        note: input.note,
        color: input.color || undefined,
      }
      db.mindMaps = db.mindMaps.map((m) =>
        m.id === input.mapId ? { ...m, nodes: [...m.nodes, node], updatedAt: now() } : m,
      )
      return node
    }),
  /** Edita rotulo e/ou resumo de um no; campos ausentes ficam como estao. */
  updateNode: (input: {
    mapId: string
    nodeId: string
    label?: string
    note?: string
    color?: string | null
  }) =>
    write((db) => {
      db.mindMaps = db.mindMaps.map((m) =>
        m.id === input.mapId
          ? {
              ...m,
              nodes: m.nodes.map((n) =>
                n.id === input.nodeId
                  ? {
                      ...n,
                      label: input.label ?? n.label,
                      // String vazia limpa o resumo; `undefined` preserva.
                      note: input.note === undefined ? n.note : input.note || undefined,
                      color: input.color === undefined ? n.color : input.color || undefined,
                    }
                  : n,
              ),
              updatedAt: now(),
            }
          : m,
      )
      return input.nodeId
    }),

  removeNode: (input: { mapId: string; nodeId: string }) =>
    write((db) => {
      const map = db.mindMaps.find((m) => m.id === input.mapId)
      if (!map) return input.nodeId

      // Um no removido leva a subarvore inteira: sem isso os filhos ficariam orfaos.
      const doomed = new Set([input.nodeId])
      let changed = true
      while (changed) {
        changed = false
        for (const node of map.nodes) {
          if (node.parentId && doomed.has(node.parentId) && !doomed.has(node.id)) {
            doomed.add(node.id)
            changed = true
          }
        }
      }

      db.mindMaps = db.mindMaps.map((m) =>
        m.id === input.mapId
          ? { ...m, nodes: m.nodes.filter((n) => !doomed.has(n.id)), updatedAt: now() }
          : m,
      )
      return input.nodeId
    }),
}

// -------------------------------------------------------------- cronograma

export const scheduleService = {
  list: () =>
    read((db) =>
      [...db.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    ),
  create: (input: {
    title: string
    type: ScheduleEvent['type']
    date: string
    durationMinutes?: number
    subjectId?: string
    description?: string
  }) =>
    write((db) => {
      const event: ScheduleEvent = {
        id: createId('ev'),
        completed: false,
        createdAt: now(),
        ...input,
      }
      db.events = [...db.events, event]
      return event
    }),
  toggle: (id: string) =>
    write((db) => {
      db.events = db.events.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
      return db.events.find((e) => e.id === id)!
    }),

  /**
   * Tira o compromisso da semana corrente empurrando-o sete dias. Nao apaga o
   * evento: ele tem data real e some do planner voltando para a paleta, de onde
   * pode ser arrastado de volta.
   */
  postponeWeek: (id: string) =>
    write((db) => {
      const event = db.events.find((e) => e.id === id)
      if (!event) return id

      const next = new Date(event.date)
      next.setDate(next.getDate() + 7)

      db.events = db.events.map((e) => (e.id === id ? { ...e, date: next.toISOString() } : e))
      return id
    }),

  /**
   * Move o evento para um dia da semana corrente, preservando o horario. Usado
   * quando um compromisso e arrastado para um dia no planner semanal.
   */
  moveToWeekday: (input: { id: string; weekday: number }) =>
    write((db) => {
      const event = db.events.find((e) => e.id === input.id)
      if (!event) return input.id

      const current = new Date(event.date)

      const target = new Date()
      target.setHours(current.getHours(), current.getMinutes(), 0, 0)
      target.setDate(target.getDate() - target.getDay() + input.weekday)

      db.events = db.events.map((e) =>
        e.id === input.id ? { ...e, date: target.toISOString() } : e,
      )
      return input.id
    }),
  remove: (id: string) =>
    write((db) => {
      db.events = db.events.filter((e) => e.id !== id)
      return id
    }),
}

// ---------------------------------------------------------------- chat IA

/**
 * O chat guarda apenas o que foi dito. Quem produz a resposta e o agente em
 * `features/ai` — aqui as mensagens sao gravadas uma a uma, na ordem em que
 * acontecem, para que a conversa sobreviva ao fechamento do app.
 */
export const aiService = {
  listConversations: () => read((db) => db.conversations),
  createConversation: (title = 'Nova conversa') =>
    write((db) => {
      const conversation: Conversation = {
        id: createId('c'),
        title,
        messages: [],
        createdAt: now(),
        updatedAt: now(),
      }
      db.conversations = [conversation, ...db.conversations]
      return conversation
    }),
  listMessages: (conversationId: string) =>
    read((db) => db.conversations.find((c) => c.id === conversationId)?.messages ?? []),

  /**
   * Acrescenta uma mensagem a conversa. A pergunta e gravada antes da chamada
   * ao modelo: se a resposta falhar, o que o usuario escreveu nao se perde.
   *
   * A primeira pergunta tambem vira o titulo, que ate entao era "Nova conversa".
   */
  addMessage: (input: { conversationId: string; content: string; role: ChatMessage['role'] }) =>
    write((db) => {
      const message: ChatMessage = {
        id: createId('m'),
        content: input.content,
        role: input.role,
        createdAt: now(),
      }

      db.conversations = db.conversations.map((c) => {
        if (c.id !== input.conversationId) return c

        const isFirstQuestion = input.role === 'user' && c.messages.length === 0
        return {
          ...c,
          title: isFirstQuestion ? titleFrom(input.content) : c.title,
          messages: [...c.messages, message],
          updatedAt: now(),
        }
      })

      return message
    }),

  /** Apaga as mensagens da conversa, que continua existindo (e reutilizavel). */
  clearMessages: (conversationId: string) =>
    write((db) => {
      db.conversations = db.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [], updatedAt: now() } : c,
      )
      return conversationId
    }),
}

/** Titulo curto o bastante para caber numa linha da lista de conversas. */
const TITLE_LIMIT = 40

function titleFrom(content: string): string {
  const clean = content.trim().replace(/\s+/g, ' ')
  return clean.length > TITLE_LIMIT ? `${clean.slice(0, TITLE_LIMIT).trimEnd()}...` : clean
}

// -------------------------------------------------------- arquivos de IA

/**
 * Arquivos que o usuario cadastra para o agente consultar sob demanda (ver
 * `read_reference_file` em `features/ai/services/agent-tools.service.ts`).
 * Ficam no banco local igual ao resto: nada e enviado a lugar nenhum ate o
 * proprio agente pedir, dentro de uma conversa.
 */
export const referenceFilesService = {
  list: () => read((db) => db.referenceFiles),
  get: (id: string) => read((db) => db.referenceFiles.find((f) => f.id === id) ?? null),
  create: (input: {
    name: string
    mimeType: ReferenceFile['mimeType']
    sizeBytes: number
    text?: string
    base64?: string
  }) =>
    write((db) => {
      const file: ReferenceFile = { id: createId('rf'), createdAt: now(), ...input }
      db.referenceFiles = [file, ...db.referenceFiles]
      return file
    }),
  remove: (id: string) =>
    write((db) => {
      db.referenceFiles = db.referenceFiles.filter((f) => f.id !== id)
      return id
    }),
}

// --------------------------------------------------------------- pomodoro

export const pomodoroService = {
  listSessions: () => read((db) => db.sessions),

  /** Registra uma sessao concluida e credita a atividade na timeline. */
  finish: async (input: { subjectId: string; minutes: number; type: StudySession['type'] }) => {
    const subjectName = await read(
      (db) => db.subjects.find((s) => s.id === input.subjectId)?.name ?? 'Estudo',
    )

    const session = await write((db) => {
      const completedAt = now()
      const startedAt = new Date(Date.now() - input.minutes * 60_000).toISOString()

      const session: StudySession = {
        id: createId('ss'),
        subjectId: input.subjectId,
        duration: input.minutes,
        startedAt,
        completedAt,
        type: input.type,
      }
      db.sessions = [session, ...db.sessions]

      pushActivity(db, {
        type: 'pomodoro',
        title: `Sessão de ${subjectName}`,
        description: `${input.minutes} min - ${subjectName}`,
        subjectId: input.subjectId,
      })

      return session
    })

    // Best-effort: o dashboard e a sequencia vivem no backend agora, mas uma
    // sessao offline nao pode se perder — ela ja esta salva localmente acima.
    studySessionsApi
      .create({ subjectId: input.subjectId, subjectName, duration: input.minutes, type: input.type })
      .catch((error) => console.error('[study-sessions] falha ao sincronizar sessao', error))

    return session
  },
}

// ------------------------------------------------------------ estatisticas

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * Chave "AAAA-MM-DD" no fuso do aparelho.
 *
 * Tem que ser local, e nao UTC: as telas remontam a data com
 * `new Date(`${chave}T00:00:00`)`, que e lido como local. Uma sessao das 21h
 * no Brasil cairia no dia seguinte se a chave saisse do `toISOString()`.
 */
function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

interface DayTotals {
  minutes: number
  pomodoros: number
}

function totalsByDay(sessions: StudySession[]): Map<string, DayTotals> {
  const totals = new Map<string, DayTotals>()

  for (const session of sessions) {
    const key = dayKey(new Date(session.completedAt))
    const current = totals.get(key) ?? { minutes: 0, pomodoros: 0 }

    totals.set(key, {
      minutes: current.minutes + session.duration,
      pomodoros: current.pomodoros + (session.type === 'pomodoro' ? 1 : 0),
    })
  }

  return totals
}

/** Serie diaria continua terminando hoje — dias sem estudo entram zerados. */
function series(totals: Map<string, DayTotals>, days: number): DailyStats[] {
  const result: DailyStats[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() - (days - 1))

  for (let i = 0; i < days; i++) {
    const key = dayKey(cursor)
    const totalsOfDay = totals.get(key) ?? { minutes: 0, pomodoros: 0 }
    result.push({ date: key, ...totalsOfDay })
    cursor.setDate(cursor.getDate() + 1)
  }

  return result
}

/**
 * Dias seguidos de estudo contados de tras para frente.
 *
 * O dia de hoje nao quebra a sequencia enquanto ainda esta em aberto: quem
 * estudou ontem e abre o app de manha continua com a ofensiva de pe.
 */
function streakOf(totals: Map<string, DayTotals>): number {
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  if (!totals.get(dayKey(cursor))?.minutes) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (totals.get(dayKey(cursor))?.minutes) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function sumMinutes(days: DailyStats[]): number {
  return days.reduce((total, day) => total + day.minutes, 0)
}

/** Quantos dias cobrem o calendario de contribuicoes comecando num domingo. */
const CALENDAR_WEEKS = 20

export const statsService = {
  dashboard: () =>
    read((db) => {
      const totals = totalsByDay(db.sessions)

      return {
        todayMinutes: totals.get(dayKey(new Date()))?.minutes ?? 0,
        weekMinutes: sumMinutes(series(totals, 7)),
        monthMinutes: sumMinutes(series(totals, 30)),
        streak: streakOf(totals),
      }
    }),

  weekly: (): Promise<DailyStats[]> => read((db) => series(totalsByDay(db.sessions), 7)),

  subjects: (): Promise<SubjectStats[]> =>
    read((db) => {
      const totals = new Map<string, SubjectStats>()

      for (const session of db.sessions) {
        const subject = db.subjects.find((s) => s.id === session.subjectId)
        const current = totals.get(session.subjectId) ?? {
          subjectId: session.subjectId,
          subjectName: subject?.name ?? 'Sem matéria',
          totalMinutes: 0,
          sessions: 0,
        }

        totals.set(session.subjectId, {
          ...current,
          totalMinutes: current.totalMinutes + session.duration,
          sessions: current.sessions + 1,
        })
      }

      return [...totals.values()].sort((a, b) => b.totalMinutes - a.totalMinutes)
    }),

  contributions: (): Promise<DailyStats[]> =>
    read((db) => {
      // Fecha a serie no ultimo sabado para que cada coluna do calendario seja
      // uma semana inteira de domingo a sabado, como no grafico do GitHub.
      const daysIntoWeek = new Date().getDay()
      return series(totalsByDay(db.sessions), (CALENDAR_WEEKS - 1) * 7 + daysIntoWeek + 1)
    }),

  activities: () => read((db) => db.activities),

  quiz: () =>
    read((db) => {
      const completed = db.quizzes.filter((q) => q.score !== undefined)
      const average = completed.length
        ? Math.round(completed.reduce((sum, q) => sum + (q.score ?? 0), 0) / completed.length)
        : 0
      return { average, total: db.quizzes.length, completed: completed.length }
    }),

  flashcards: () => read((db) => ({ total: db.flashcards.length })),

  pomodoro: () =>
    read((db) => ({
      totalPomodoros: db.sessions.filter((s) => s.type === 'pomodoro').length,
    })),
}

// ---------------------------------------------------------- configuracoes

export const settingsService = {
  get: () => read((db) => db.settings),
  update: (patch: Partial<Database['settings']>) =>
    write((db) => {
      db.settings = { ...db.settings, ...patch }
      return db.settings
    }),
}
