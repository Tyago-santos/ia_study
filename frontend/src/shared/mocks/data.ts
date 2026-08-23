import type {
  User,
  Subject,
  Topic,
  StudySession,
  Flashcard,
  Quiz,
  Summary,
  MindMap,
  Conversation,
  DailyStats,
  SubjectStats,
  ScheduleEvent,
  Activity,
} from '@/shared/types'

export const mockUser: User = {
  id: 'u1',
  name: 'Tiago Almeida',
  email: 'tiago@example.com',
  bio: 'Estudante de Engenharia',
  avatar: '',
  createdAt: '2025-01-15T10:00:00Z',
}

export const mockSubjects: Subject[] = [
  { id: 's1', name: 'Calculo I', color: '#2fa35c', icon: 'Calculator', createdAt: '2025-01-15T10:00:00Z' },
  { id: 's2', name: 'Fisica', color: '#f59e0b', icon: 'Atom', createdAt: '2025-01-15T10:00:00Z' },
  { id: 's3', name: 'Programacao', color: '#10b981', icon: 'Code', createdAt: '2025-01-20T10:00:00Z' },
  { id: 's4', name: 'Quimica', color: '#ef4444', icon: 'FlaskConical', createdAt: '2025-02-01T10:00:00Z' },
  { id: 's5', name: 'Historia', color: '#d08a1e', icon: 'BookOpen', createdAt: '2025-02-10T10:00:00Z' },
]

export const mockTopics: Topic[] = [
  { id: 't1', subjectId: 's1', name: 'Limites e continuidade', completed: true, createdAt: '2025-01-16T10:00:00Z' },
  { id: 't2', subjectId: 's1', name: 'Regras de derivacao', completed: true, createdAt: '2025-01-16T10:00:00Z' },
  { id: 't3', subjectId: 's1', name: 'Integrais definidas', completed: false, createdAt: '2025-01-20T10:00:00Z' },
  { id: 't4', subjectId: 's2', name: 'Leis de Newton', completed: true, createdAt: '2025-01-16T10:00:00Z' },
  { id: 't5', subjectId: 's2', name: 'Cinematica', completed: false, createdAt: '2025-01-18T10:00:00Z' },
  { id: 't6', subjectId: 's3', name: 'Estruturas de dados', completed: false, createdAt: '2025-01-21T10:00:00Z' },
  { id: 't7', subjectId: 's3', name: 'Promises e async/await', completed: true, createdAt: '2025-01-22T10:00:00Z' },
  { id: 't8', subjectId: 's4', name: 'Estequiometria', completed: false, createdAt: '2025-02-02T10:00:00Z' },
  { id: 't9', subjectId: 's5', name: 'Revolucao Industrial', completed: false, createdAt: '2025-02-11T10:00:00Z' },
]

export const mockSessions: StudySession[] = [
  { id: 'ss1', subjectId: 's1', duration: 25, startedAt: '2025-07-26T08:00:00Z', completedAt: '2025-07-26T08:25:00Z', type: 'pomodoro' },
  { id: 'ss2', subjectId: 's3', duration: 50, startedAt: '2025-07-26T06:00:00Z', completedAt: '2025-07-26T06:50:00Z', type: 'pomodoro' },
  { id: 'ss3', subjectId: 's2', duration: 30, startedAt: '2025-07-25T14:00:00Z', completedAt: '2025-07-25T14:30:00Z', type: 'free' },
  { id: 'ss4', subjectId: 's1', duration: 25, startedAt: '2025-07-25T10:00:00Z', completedAt: '2025-07-25T10:25:00Z', type: 'pomodoro' },
  { id: 'ss5', subjectId: 's4', duration: 45, startedAt: '2025-07-24T16:00:00Z', completedAt: '2025-07-24T16:45:00Z', type: 'pomodoro' },
]

export const mockFlashcards: Flashcard[] = [
  {
    id: 'fc1', subjectId: 's1', front: 'O que e derivada?',
    back: 'A derivada de uma funcao representa a taxa de variacao instantanea da funcao em relacao a sua variavel.',
    difficulty: 'medium', nextReview: '2025-07-26T00:00:00Z', reviewCount: 3, createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'fc2', subjectId: 's1', front: 'Regra do produto',
    back: "(f*g)' = f'*g + f*g'",
    difficulty: 'easy', nextReview: '2025-07-26T00:00:00Z', reviewCount: 5, createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'fc3', subjectId: 's2', front: 'Primeira lei de Newton',
    back: 'Um corpo em repouso ou movimento retinlineo uniforme permanece nesse estado, a menos que uma fuerca externa atue sobre ele.',
    difficulty: 'medium', nextReview: '2025-07-26T00:00:00Z', reviewCount: 2, createdAt: '2025-03-05T10:00:00Z',
  },
  {
    id: 'fc4', subjectId: 's3', front: 'O que e uma Promise em JS?',
    back: 'Um objeto que representa a eventual conclusao (ou falha) de uma operacao assincrona.',
    difficulty: 'hard', nextReview: '2025-07-26T00:00:00Z', reviewCount: 1, createdAt: '2025-03-10T10:00:00Z',
  },
  {
    id: 'fc5', subjectId: 's4', front: 'O que e mol?',
    back: 'A unidade de medida que representa aproximadamente 6,022x10^23 entidades.',
    difficulty: 'easy', nextReview: '2025-07-26T00:00:00Z', reviewCount: 4, createdAt: '2025-03-15T10:00:00Z',
  },
]

export const mockQuizzes: Quiz[] = [
  {
    id: 'q1', subjectId: 's1', title: 'Derivadas - Basico', score: 80, completedAt: '2025-07-23T10:00:00Z',
    questions: [
      { id: 'qq1', question: 'Qual a derivada de x^2?', options: ['2x', 'x', '2x^2', 'x^3'], correctAnswer: 0, userAnswer: 0 },
      { id: 'qq2', question: 'Qual a derivada de sen(x)?', options: ['cos(x)', '-cos(x)', '-sen(x)', 'tan(x)'], correctAnswer: 0, userAnswer: 2 },
    ],
    createdAt: '2025-07-23T10:00:00Z',
  },
  {
    id: 'q2', subjectId: 's3', title: 'JavaScript Basico',
    questions: [
      { id: 'qq3', question: 'O que e "hoisting"?', options: ['Elevacao de declaracoes', 'Um tipo de loop', 'Uma funcao nativa', 'Um operador'], correctAnswer: 0 },
      { id: 'qq4', question: 'typeof null retorna?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correctAnswer: 2 },
    ],
    createdAt: '2025-07-25T10:00:00Z',
  },
]

export const mockSummaries: Summary[] = [
  {
    id: 'r1', subjectId: 's1', title: 'Derivadas e Integrais',
    content: 'Derivada e a taxa de variacao de uma funcao. Regras principais: regra do produto, quociente e cadeia. Integrais sao operacoes inversas das derivadas.',
    sourceType: 'text', createdAt: '2025-07-21T10:00:00Z',
  },
  {
    id: 'r2', subjectId: 's2', title: 'Leis de Newton',
    content: 'As tres leis do movimento de Newton descrevem a relacao entre fuercas e movimento dos corpos.',
    sourceType: 'text', createdAt: '2025-07-24T10:00:00Z',
  },
]

export const mockMindMaps: MindMap[] = [
  {
    id: 'mm1', subjectId: 's1', title: 'Derivadas', description: 'Panorama do calculo diferencial',
    createdAt: '2025-07-20T10:00:00Z', updatedAt: '2025-07-25T10:00:00Z',
    nodes: [
      { id: 'mm1_n1', parentId: null, label: 'Derivadas' },
      { id: 'mm1_n2', parentId: 'mm1_n1', label: 'Definicao', note: 'Limite da taxa de variacao media quando o intervalo tende a zero.' },
      { id: 'mm1_n3', parentId: 'mm1_n2', label: 'Limite do quociente' },
      { id: 'mm1_n4', parentId: 'mm1_n2', label: 'Reta tangente' },
      { id: 'mm1_n5', parentId: 'mm1_n1', label: 'Regras de derivacao' },
      { id: 'mm1_n6', parentId: 'mm1_n5', label: 'Produto' },
      { id: 'mm1_n7', parentId: 'mm1_n5', label: 'Quociente' },
      { id: 'mm1_n8', parentId: 'mm1_n5', label: 'Cadeia' },
      { id: 'mm1_n9', parentId: 'mm1_n1', label: 'Aplicacoes' },
      { id: 'mm1_n10', parentId: 'mm1_n9', label: 'Maximos e minimos' },
      { id: 'mm1_n11', parentId: 'mm1_n9', label: 'Taxas relacionadas' },
      { id: 'mm1_n12', parentId: 'mm1_n1', label: 'Erros comuns', note: 'Esquecer a regra da cadeia em funcoes compostas.' },
    ],
  },
  {
    id: 'mm2', subjectId: 's3', title: 'Estruturas de Dados', description: 'Mapa de revisao para a prova',
    createdAt: '2025-07-22T10:00:00Z', updatedAt: '2025-07-22T10:00:00Z',
    nodes: [
      { id: 'mm2_n1', parentId: null, label: 'Estruturas de Dados' },
      { id: 'mm2_n2', parentId: 'mm2_n1', label: 'Lineares' },
      { id: 'mm2_n3', parentId: 'mm2_n2', label: 'Array' },
      { id: 'mm2_n4', parentId: 'mm2_n2', label: 'Lista ligada' },
      { id: 'mm2_n5', parentId: 'mm2_n2', label: 'Pilha e fila' },
      { id: 'mm2_n6', parentId: 'mm2_n1', label: 'Nao lineares' },
      { id: 'mm2_n7', parentId: 'mm2_n6', label: 'Arvores' },
      { id: 'mm2_n8', parentId: 'mm2_n6', label: 'Grafos' },
      { id: 'mm2_n9', parentId: 'mm2_n1', label: 'Complexidade', note: 'Comparar custo de busca, insercao e remocao.' },
      { id: 'mm2_n10', parentId: 'mm2_n9', label: 'O(1) e O(log n)' },
      { id: 'mm2_n11', parentId: 'mm2_n9', label: 'O(n) e O(n log n)' },
    ],
  },
]

export const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: 'ev1', title: 'Prova de Calculo I', type: 'prova', subjectId: 's1',
    date: '2025-07-29T13:00:00Z', description: 'Limites, derivadas e integrais definidas.',
    completed: false, createdAt: '2025-07-15T10:00:00Z',
  },
  {
    id: 'ev2', title: 'Revisar Leis de Newton', type: 'estudo', subjectId: 's2',
    date: '2025-07-27T18:00:00Z', description: 'Revisao geral antes da prova.',
    completed: false, createdAt: '2025-07-20T10:00:00Z',
  },
  {
    id: 'ev3', title: 'Entrega do trabalho de Programacao', type: 'trabalho', subjectId: 's3',
    date: '2025-08-02T23:59:00Z', description: 'Projeto final da disciplina.',
    completed: false, createdAt: '2025-07-18T10:00:00Z',
  },
  {
    id: 'ev4', title: 'Prova de Quimica', type: 'prova', subjectId: 's4',
    date: '2025-07-24T13:00:00Z', description: 'Estequiometria e ligacoes quimicas.',
    completed: true, createdAt: '2025-07-10T10:00:00Z',
  },
]

export const mockConversations: Conversation[] = [
  {
    id: 'c1', title: 'Explicacao de Derivadas', createdAt: '2025-07-23T10:00:00Z', updatedAt: '2025-07-23T10:00:00Z',
    messages: [
      { id: 'm1', content: 'O que e uma derivada?', role: 'user', createdAt: '2025-07-23T10:00:00Z' },
      { id: 'm2', content: 'Uma derivada representa a taxa de variacao instantanea de uma funcao.', role: 'assistant', createdAt: '2025-07-23T10:00:00Z' },
    ],
  },
]

export const mockSubjectStats: SubjectStats[] = [
  { subjectId: 's1', subjectName: 'Calculo I', totalMinutes: 480, sessions: 18 },
  { subjectId: 's3', subjectName: 'Programacao', totalMinutes: 360, sessions: 14 },
  { subjectId: 's2', subjectName: 'Fisica', totalMinutes: 240, sessions: 9 },
  { subjectId: 's4', subjectName: 'Quimica', totalMinutes: 180, sessions: 7 },
]

export const mockWeeklyStats: { days: DailyStats[] } = {
  days: [
    { date: '2025-07-20', minutes: 45, pomodoros: 2 },
    { date: '2025-07-21', minutes: 120, pomodoros: 4 },
    { date: '2025-07-22', minutes: 80, pomodoros: 3 },
    { date: '2025-07-23', minutes: 60, pomodoros: 2 },
    { date: '2025-07-24', minutes: 90, pomodoros: 3 },
    { date: '2025-07-25', minutes: 110, pomodoros: 4 },
    { date: '2025-07-26', minutes: 75, pomodoros: 3 },
  ],
}

/**
 * Serie de 30 dias terminando no mesmo dia de `mockWeeklyStats` (2025-07-26),
 * cobrindo exatamente a janela que o filtro "30 dias" pede.
 *
 * Os ultimos 7 dias SAO a semana, para que o card e o grafico logo abaixo dele
 * nunca discordem. Os 23 anteriores vem do gerador com semente, entao a forma do
 * grafico nao muda a cada recarga da pagina.
 */
export const mockMonthlyStats: { days: DailyStats[] } = {
  days: [...generateYearlyActivity('2025-07-19', 23), ...mockWeeklyStats.days],
}

function sumMinutes(days: DailyStats[]): number {
  return days.reduce((total, day) => total + day.minutes, 0)
}

const WEEKLY_GOAL_MINUTES = 600

/**
 * Derivado das series acima em vez de escrito a mao: um numero solto aqui
 * apareceria no card contradizendo o grafico que usa a mesma fonte.
 */
export const mockDashboardStats = {
  todayMinutes: mockWeeklyStats.days[mockWeeklyStats.days.length - 1].minutes,
  weekMinutes: sumMinutes(mockWeeklyStats.days),
  monthMinutes: sumMinutes(mockMonthlyStats.days),
  streak: 7,
  weeklyGoal: WEEKLY_GOAL_MINUTES,
  weeklyGoalProgress: Math.round(
    (sumMinutes(mockWeeklyStats.days) / WEEKLY_GOAL_MINUTES) * 100
  ),
}

function generateYearlyActivity(endDate: string, days: number): DailyStats[] {
  const end = new Date(`${endDate}T00:00:00Z`)
  const result: DailyStats[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setUTCDate(d.getUTCDate() - i)
    const dateStr = d.toISOString().slice(0, 10)

    const seed = Array.from(dateStr).reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7)
    const rand = Math.abs(Math.sin(seed))
    const isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6
    const skipped = rand < (isWeekend ? 0.45 : 0.25)
    const minutes = skipped ? 0 : Math.round(15 + rand * 135)
    const pomodoros = minutes === 0 ? 0 : Math.max(1, Math.round(minutes / 25))

    result.push({ date: dateStr, minutes, pomodoros })
  }

  return result
}

export const mockYearlyActivity: DailyStats[] = generateYearlyActivity('2025-07-26', 371)
  .map((day) => {
    const overlap = mockWeeklyStats.days.find((w) => w.date === day.date)
    return overlap ? { ...overlap } : day
  })

export const mockActivities: (Activity & { subjectId: string })[] = [
  { id: 'a1', type: 'pomodoro', title: 'Sessao de Calculo', description: '25 min - Calculo I', subjectId: 's1', createdAt: '2025-07-26T08:25:00Z' },
  { id: 'a2', type: 'quiz', title: 'Quiz JavaScript Basico', description: 'Score: 100%', subjectId: 's3', createdAt: '2025-07-25T10:00:00Z' },
  { id: 'a3', type: 'flashcard', title: 'Revisao de Flashcards', description: '5 flashcards revisados', subjectId: 's1', createdAt: '2025-07-24T17:00:00Z' },
  { id: 'a4', type: 'summary', title: 'Resumo: Leis de Newton', description: 'Resumo criado', subjectId: 's2', createdAt: '2025-07-24T14:00:00Z' },
  { id: 'a5', type: 'pomodoro', title: 'Sessao de Programacao', description: '50 min - Programacao', subjectId: 's3', createdAt: '2025-07-26T06:50:00Z' },
  { id: 'a6', type: 'quiz', title: 'Quiz Derivadas', description: 'Score: 80%', subjectId: 's1', createdAt: '2025-07-23T10:00:00Z' },
  { id: 'a7', type: 'flashcard', title: 'Novos Flashcards', description: '3 flashcards criados', subjectId: 's3', createdAt: '2025-07-22T09:00:00Z' },
  { id: 'a8', type: 'pomodoro', title: 'Sessao de Fisica', description: '30 min - Fisica', subjectId: 's2', createdAt: '2025-07-25T14:30:00Z' },
]

export const mockSettings = {
  theme: 'light' as const,
  fontSize: 'medium' as const,
  language: 'pt-BR',
  notifications: true,
  pomodoro: { focus: 25, shortBreak: 5, longBreak: 15 },
}
