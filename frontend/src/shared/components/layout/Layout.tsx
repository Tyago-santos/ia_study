import { useState } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { PomodoroEngine } from '@/features/pomodoro/components/PomodoroEngine'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout() {
  const location = useLocation()
  const isImmersive = location.pathname.startsWith('/ai')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <PomodoroEngine />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} immersive={isImmersive} />
        <main
          className={
            isImmersive ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
