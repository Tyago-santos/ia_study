export type Theme = 'light' | 'dark' | 'reading'

export interface User {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
  createdAt?: string
  lastLoginAt?: string
}

export interface Subject {
  id: string
  name: string
  color: string
  icon?: string
  createdAt: string
}

export interface Topic {
  id: string
  subjectId: string
  name: string
  completed: boolean
  createdAt: string
}

export interface StudySession {
  id: string
  subjectId: string
  duration: number
  startedAt: string
  completedAt: string
  type: 'pomodoro' | 'free'
}

export interface Flashcard {
  id: string
  subjectId: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
  nextReview: string
  reviewCount: number
  createdAt: string
}

export interface Quiz {
  id: string
  subjectId: string
  title: string
  questions: QuizQuestion[]
  score?: number
  completedAt?: string
  createdAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  userAnswer?: number
}

export interface Summary {
  id: string
  subjectId: string
  title: string
  content: string
  sourceType: 'text' | 'pdf' | 'image'
  createdAt: string
}

/**
 * Mind map nodes are stored as a flat list linked by `parentId` (the root has
 * `parentId: null`). The visual layout is derived from this tree, so only nodes
 * the user dragged by hand carry an explicit `position`.
 */
export interface MindMapNode {
  id: string
  parentId: string | null
  label: string
  note?: string
  color?: string
  collapsed?: boolean
  position?: { x: number; y: number }
}

export interface MindMap {
  id: string
  subjectId: string
  title: string
  description?: string
  nodes: MindMapNode[]
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface DailyStats {
  date: string
  minutes: number
  pomodoros: number
}

export interface SubjectStats {
  subjectId: string
  subjectName: string
  totalMinutes: number
  sessions: number
}

export interface ScheduleEvent {
  id: string
  title: string
  type: 'prova' | 'estudo' | 'trabalho' | 'aula' | 'outro'
  subjectId?: string
  date: string
  /** Duracao prevista em minutos; ausente = evento sem duracao definida. */
  durationMinutes?: number
  description?: string
  completed: boolean
  createdAt: string
}

export interface Activity {
  id: string
  type: 'pomodoro' | 'quiz' | 'flashcard' | 'summary'
  title: string
  description: string
  subjectId: string | null
  createdAt: string
}

export interface PlanBlock {
  id: string
  subjectId: string
  subjectName: string
  subjectColor: string
  duration: number
  topicId?: string
  topicName?: string
}

export interface DayPlan {
  dayName: string
  dayIndex: number
  blocks: PlanBlock[]
}
