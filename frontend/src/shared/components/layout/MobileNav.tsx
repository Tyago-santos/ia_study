import { Link, useLocation } from '@tanstack/react-router'
import { LayoutDashboard, CalendarClock, Sparkles, Layers, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

/**
 * Barra inferior fixa do app em telas pequenas: a mesma familia de itens da
 * sidebar, com o Tutor IA elevado no centro (FAB) como no design Stitch.
 * Fica escondida no /ai, que e' imersivo e ja' tem o composer no rodape.
 */
const items = [
  { name: 'Dashboard', short: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cronograma', short: 'Agenda', href: '/cronograma', icon: CalendarClock },
  { name: 'Tutor IA', short: 'Tutor IA', href: '/ai', icon: Sparkles, fab: true },
  { name: 'Flashcards', short: 'Cards', href: '/flashcards', icon: Layers },
  { name: 'Perfil', short: 'Perfil', href: '/perfil', icon: User },
]

export function MobileNav() {
  const location = useLocation()

  if (location.pathname.startsWith('/ai')) return null

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegacao principal"
    >
      <ul className="flex items-end justify-around h-16">
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          const label = item.short

          if (item.fab) {
            return (
              <li key={item.href} className="-mt-5">
                {/* halo que pulsa atras do FAB — chamada para a acao principal */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none block w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 animate-halo"
                />
                <Link
                  to={item.href}
                  aria-label={item.name}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative -mt-14 flex flex-col items-center justify-center w-14 h-14 rounded-full',
                    'bg-gradient-to-br from-primary-500 to-secondary-500 text-white',
                    'shadow-lg shadow-primary-500/40 transition-transform hover:scale-105 active:scale-95',
                    isActive && 'ring-4 ring-[var(--bg)]'
                  )}
                >
                  <item.icon className="w-6 h-6 animate-sparkle" />
                </Link>
                <span className="block mt-1 text-[10px] font-semibold text-center text-[var(--accent-text)]">
                  {label}
                </span>
              </li>
            )
          }

          return (
            <li key={item.href}>
              <Link
                to={item.href}
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-xl transition-colors',
                  isActive ? 'text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-9 h-7 rounded-full transition-colors',
                    isActive && 'bg-primary-500/15'
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                </span>
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
