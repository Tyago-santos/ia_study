import { useEffect, useState } from 'react'
import { ErrorState, StatsSkeleton } from '@/shared/components/ui'
import { useThemeStore } from '@/shared/store/theme'
import type { Theme } from '@/shared/types'
import { useSettings, useUpdateSettings } from '@/features/settings/hooks/useSettings'
import type { FontSize } from '@/features/settings/lib/themeOptions'
import { AppearanceCard } from '../components/AppearanceCard'
import { GeneralSettingsCard } from '../components/GeneralSettingsCard'

export function SettingsPage() {
  const { data: settings, isLoading, error, refetch } = useSettings()
  const updateSettings = useUpdateSettings()
  const { theme, setTheme } = useThemeStore()

  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [language, setLanguage] = useState('pt-BR')
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    if (settings) {
      setFontSize(settings.fontSize)
      setLanguage(settings.language)
      setNotifications(settings.notifications)
    }
  }, [settings])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    updateSettings.mutate({ theme: newTheme })
  }

  if (error) {
    return <ErrorState message="Erro ao carregar configurações" onRetry={refetch} />
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-[var(--bg-secondary)] rounded animate-pulse" />
        <StatsSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Configurações</h1>
        <p className="text-sm text-[var(--text-secondary)]">Personalize sua experiência</p>
      </div>

      <AppearanceCard theme={theme} onThemeChange={handleThemeChange} />

      <GeneralSettingsCard
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        language={language}
        onLanguageChange={setLanguage}
        notifications={notifications}
        onNotificationsChange={setNotifications}
        onSave={() => updateSettings.mutate({ fontSize, language, notifications })}
        isSaving={updateSettings.isPending}
      />
    </div>
  )
}
