import type { ReactNode } from 'react'
import { AnimatedLogo, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AnimatedLogo size={64} />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-[var(--text-secondary)]">{subtitle}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
