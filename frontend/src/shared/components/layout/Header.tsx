import { Moon, Sun, BookOpen, Bell, Search, Menu } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { PENDING_BACKEND_HINT } from '@/shared/constants/pendingFeature'
import { useThemeStore } from '@/shared/store/theme'
import type { Theme } from '@/shared/types'
import { PomodoroWidget } from '@/features/pomodoro/components/PomodoroWidget'

interface HeaderProps {
  onMenuClick?: () => void
  immersive?: boolean
}

const THEME_ORDER: Theme[] = ['light', 'dark', 'reading']

/** Nomes dos temas na lingua da interface; `theme` é identificador interno. */
const THEME_LABELS: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  reading: 'Leitura',
}

export function Header({ onMenuClick, immersive }: HeaderProps) {
  const { theme, setTheme } = useThemeStore()

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
      <header className="relative z-30 flex items-center gap-3 px-4 py-3 bg-[var(--bg)] lg:hidden">
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
    <header className="relative z-30 flex items-center justify-between gap-3 px-3 sm:px-6 py-3 bg-[var(--bg)]">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-md">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)] lg:hidden"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          {/* Busca global ainda nao existe; desabilitada em vez de aceitar digitacao e ignorar. */}
          <input
            type="text"
            disabled
            placeholder="Buscar matérias, resumos e flashcards"
            aria-label="Buscar no Gnosis IA"
            title={`Busca global: ${PENDING_BACKEND_HINT.toLowerCase()}`}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] cursor-not-allowed opacity-60 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <PomodoroWidget />

        {/*
          O ponto vermelho de "nao lidas" foi removido: nao existe notificacao
          nenhuma no sistema, entao ele afirmava um estado inventado.
        */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl"
          disabled
          aria-label="Notificações"
          title={`Notificações: ${PENDING_BACKEND_HINT.toLowerCase()}`}
        >
          <Bell className="w-[18px] h-[18px]" />
        </Button>

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
