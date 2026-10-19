import { useEffect, useState } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { PomodoroEngine } from '@/features/pomodoro/components/PomodoroEngine'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { useWakeLock } from '@/shared/hooks/useWakeLock'

export function Layout() {
  const location = useLocation()
  const isImmersive = location.pathname.startsWith('/ai')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mantem a tela acesa enquanto o app esta aberto (timer, leitura etc.)
  useWakeLock()

  // Fecha o drawer em QUALQUER navegacao — nao so nos links da sidebar
  // (voltar do navegador, link do Pomodoro/Notificacoes etc.)
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* brilho difuso atras de tudo — os cards com backdrop-blur o desfocam */}
      <div aria-hidden="true" className="app-glow pointer-events-none fixed inset-0 -z-10" />
      <PomodoroEngine />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} immersive={isImmersive} />
        <main
          key={location.pathname}
          className={
            isImmersive
              ? 'animate-page flex-1 overflow-hidden'
              : // pb-20 abre espaco para a barra inferior fixa (MobileNav) e o
                // env(safe-area-inset-bottom) cobre o gesto do iOS.
                'flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 pb-[max(env(safe-area-inset-bottom),5rem)] lg:pb-6'
          }
        >
          <div key={location.pathname} className="animate-page min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
