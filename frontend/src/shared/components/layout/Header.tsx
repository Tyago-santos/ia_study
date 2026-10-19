import { Moon, Sun, BookOpen, Menu } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import { Button } from '@/shared/components/ui'
import { useThemeStore } from '@/shared/store/theme'
import type { Theme } from '@/shared/types'
import { NotificationsBell } from '@/features/notifications/components/NotificationsBell'
import { PomodoroWidget } from '@/features/pomodoro/components/PomodoroWidget'

interface HeaderProps {
  onMenuClick?: () => void
  immersive?: boolean
}

const THEME_ORDER: Theme[] = ['light', 'dark', 'reading']

/** Nomes dos temas na lingua da interface; `theme` e' identificador interno. */
const THEME_LABELS: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  reading: 'Leitura',
}

/** Titulo da tela atual — o Stitch mostra produto + pagina no topo. */
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ai': 'Tutor IA',
  '/flashcards': 'Flashcards',
  '/quiz': 'Quiz',
  '/resumos': 'Resumos',
  '/mapas-mentais': 'Mapas Mentais',
  '/cronograma': 'Cronograma',
  '/biblioteca': 'Biblioteca',
  '/estatisticas': 'Estatisticas',
  '/perfil': 'Perfil',
  '/configuracoes': 'Configuracoes',
}

export function Header({ onMenuClick, immersive }: HeaderProps) {
  const { theme, setTheme } = useThemeStore()
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'StudyHub AI'

  const nextTheme = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length]

  const cycleTheme = () => setTheme(nextTheme)

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-[18px] h-[18px]" />
      case 'reading':
        return <BookOpen className="w-[18px] h-[18px]" />
      default:
        return <Sun className="w-[18px] h-[18px]" />
    }
  }

  if (immersive) {
    return (
      <header
        className="relative z-30 flex items-center gap-3 px-4 py-3 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl lg:hidden"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
      >
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)]"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>
        <span className="text-sm font-bold text-[var(--text)] flex-1">Gnosis IA</span>
        <PomodoroWidget compact />
      </header>
    )
  }

  return (
    <header
      className="relative z-30 flex items-center justify-between gap-3 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 backdrop-blur-2xl sm:px-6 py-3"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)] lg:hidden"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>

        {/* produto + pagina, como no topo das telas do Stitch */}
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold text-[var(--text)]">Gnosis IA</p>
          <p className="truncate text-xs text-[var(--text-secondary)]">{pageTitle}</p>
        </div>
      </div>

      {/* shrink-0 nos itens fixos + widget do pomodoro pode encolher em 320px */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <PomodoroWidget />

        <NotificationsBell />

        <Button
          variant="ghost"
          size="sm"
          onClick={cycleTheme}
          className="rounded-xl"
          // O rotulo nomeia o que o clique faz, nao o estado atual.
          aria-label={`Mudar para o tema ${THEME_LABELS[nextTheme]}`}
          title={`Tema ${THEME_LABELS[theme]} — clique para ${THEME_LABELS[nextTheme]}`}
        >
          {getThemeIcon()}
        </Button>

        <div className="ml-2 flex items-center gap-2.5 pl-3 border-l border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-[var(--on-accent)] text-xs font-bold shadow-md shadow-primary-500/20">
            TA
          </div>
        </div>
      </div>
    </header>
  )
}
