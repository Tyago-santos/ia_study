import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'
import { Layout } from '@/shared/components/layout'
import { useAuthStore } from '@/shared/store/auth'
import { AIPage } from '@/features/ai/pages/AIPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { FlashcardsPage } from '@/features/flashcards/pages/FlashcardsPage'
import { LibraryPage } from '@/features/library/pages/LibraryPage'
import { MindMapsPage } from '@/features/mindmaps/pages/MindMapsPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { QuizPage } from '@/features/quiz/pages/QuizPage'
import { SchedulePage } from '@/features/schedule/pages/SchedulePage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { StatisticsPage } from '@/features/statistics/pages/StatisticsPage'
import { SummariesPage } from '@/features/summaries/pages/SummariesPage'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cadastro',
  component: RegisterPage,
})

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: Layout,
  // A sessao vive num cookie httpOnly — o front nao le' o cookie, so' pergunta
  // pro backend (`/users/me`) se ele ainda vale antes de entrar numa rota
  // protegida.
  beforeLoad: async () => {
    const ok = await useAuthStore.getState().checkAuth()
    if (!ok) throw redirect({ to: '/login' })
  },
})

// Route paths stay in pt-BR because they are user-facing URLs; only the
// feature/page identifiers behind them were renamed to English.
const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const aiRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/ai',
  component: AIPage,
})

const flashcardsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/flashcards',
  component: FlashcardsPage,
})

const quizRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/quiz',
  component: QuizPage,
})

const summariesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/resumos',
  component: SummariesPage,
})

const mindMapsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/mapas-mentais',
  component: MindMapsPage,
})

const scheduleRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/cronograma',
  component: SchedulePage,
})

const libraryRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/biblioteca',
  component: LibraryPage,
})

const statisticsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/estatisticas',
  component: StatisticsPage,
})

const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/perfil',
  component: ProfilePage,
})

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/configuracoes',
  component: SettingsPage,
})

const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  appLayoutRoute.addChildren([
    indexRoute,
    dashboardRoute,
    aiRoute,
    flashcardsRoute,
    quizRoute,
    summariesRoute,
    mindMapsRoute,
    scheduleRoute,
    libraryRoute,
    statisticsRoute,
    profileRoute,
    settingsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
