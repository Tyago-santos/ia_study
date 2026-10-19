import type { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { LogIn, UserPlus } from 'lucide-react'
import { AnimatedLogo, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  const { pathname } = useLocation()
  const isRegister = pathname.startsWith('/cadastro')

  const tabClass = (active: boolean) =>
    cn(
      'flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all',
      active
        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm shadow-primary-500/30'
        : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
    )

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center mb-3">
          <div className="flex justify-center mb-4">
            <AnimatedLogo size={64} />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <p className="text-[var(--text-secondary)]">{subtitle}</p>
        </CardHeader>

        <nav
          aria-label="Entrar ou criar conta"
          className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1"
        >
          <Link to="/login" className={tabClass(!isRegister)} aria-current={!isRegister ? 'page' : undefined}>
            <LogIn className="w-4 h-4" />
            Entrar
          </Link>
          <Link to="/cadastro" className={tabClass(isRegister)} aria-current={isRegister ? 'page' : undefined}>
            <UserPlus className="w-4 h-4" />
            Criar Conta
          </Link>
        </nav>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
