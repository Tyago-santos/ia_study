import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  HelpCircle,
  FileText,
  Network,
  Library,
  BarChart3,
  Settings,
  User,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { AnimatedLogo } from '@/shared/components/ui'
import { useAuthStore } from '@/shared/store/auth'

const aiNavigation = { name: 'Chat IA', href: '/ai', icon: Sparkles }

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cronograma', href: '/cronograma', icon: CalendarClock },
  { name: 'Flashcards', href: '/flashcards', icon: Layers },
  { name: 'Quiz', href: '/quiz', icon: HelpCircle },
  { name: 'Resumos', href: '/resumos', icon: FileText },
  { name: 'Mapas Mentais', href: '/mapas-mentais', icon: Network },
  { name: 'Biblioteca', href: '/biblioteca', icon: Library },
  { name: 'Estatisticas', href: '/estatisticas', icon: BarChart3 },
]

const bottomNavigation = [
  { name: 'Perfil', href: '/perfil', icon: User },
  { name: 'Configuracoes', href: '/configuracoes', icon: Settings },
]

interface SidebarProps {
  className?: string
  mobileOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, mobileOpen = false, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    onClose?.()
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'flex flex-col h-dvh transition-all duration-300 ease-in-out',
          'backdrop-blur-xl border-r',
          'fixed inset-y-0 left-0 z-50 lg:static lg:z-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
          'w-64',
          'bg-[var(--sidebar-bg)] border-[var(--glass-border)]',
          'shadow-[var(--glass-shadow)]',
          className
        )}
      >
        <div
          className={cn(
            'flex items-center border-b border-[var(--glass-border)] transition-all duration-300',
            collapsed ? 'justify-center px-2 py-5' : 'gap-3 px-5 py-5'
          )}
        >
          <AnimatedLogo size={36} className="shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">
              Gnosis IA
            </span>
          )}
          <button
            onClick={onClose}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] lg:hidden"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          <Link
            to={aiNavigation.href}
            onClick={onClose}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl text-sm font-semibold mb-3',
              'transition-all duration-300 ease-out',
              collapsed ? 'justify-center px-2 py-3' : 'px-3 py-3',
              'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
              'shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-[1.02]',
              location.pathname.startsWith(aiNavigation.href) &&
                'ring-2 ring-primary-300/60 ring-offset-2 ring-offset-[var(--sidebar-bg)]'
            )}
            title={collapsed ? aiNavigation.name : undefined}
          >
            <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sparkles className="w-[18px] h-[18px] shrink-0 relative" />
            {!collapsed && (
              <>
                <span className="relative">{aiNavigation.name}</span>
                <span className="relative ml-auto text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-md tracking-wide">
                  IA
                </span>
              </>
            )}
          </Link>

          {!collapsed && (
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]/70">
              Menu
            </p>
          )}

          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                  collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-primary-400/10 text-[var(--accent-text)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)]'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn('w-[18px] h-[18px] shrink-0', isActive && 'text-[var(--accent-text)]')} />
                {!collapsed && <span>{item.name}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-2.5 py-3 border-t border-[var(--glass-border)] space-y-0.5">
          {bottomNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                  collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-primary-400/10 text-[var(--accent-text)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)]'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn('w-[18px] h-[18px] shrink-0', isActive && 'text-[var(--accent-text)]')} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full rounded-xl text-sm font-medium transition-all duration-200',
              collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
              'text-[var(--text-secondary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]'
            )}
            title={collapsed ? 'Sair' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'hidden lg:flex items-center gap-3 w-full rounded-xl text-sm font-medium transition-all duration-200',
              collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
              'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)]'
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-[18px] h-[18px]" />
            ) : (
              <>
                <ChevronLeft className="w-[18px] h-[18px]" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
