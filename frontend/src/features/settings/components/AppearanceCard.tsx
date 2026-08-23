import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import type { Theme } from '@/shared/types'
import { THEME_OPTIONS } from '@/features/settings/lib/themeOptions'

interface AppearanceCardProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

export function AppearanceCard({ theme, onThemeChange }: AppearanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-[var(--text)] mb-3">Tema</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {THEME_OPTIONS.map((option) => {
              const active = theme === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => onThemeChange(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-2.5 sm:p-4 rounded-lg border transition-all duration-200',
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border)] hover:border-[var(--text-secondary)] bg-[var(--card-bg)]'
                  )}
                >
                  <option.icon
                    className={cn('w-6 h-6', active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]')}
                  />
                  <span className="text-sm font-medium text-[var(--text)]">{option.label}</span>
                  <span className="text-xs text-[var(--text-secondary)] text-center">
                    {option.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
