import { Bell, Globe, Type } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import {
  FONT_SIZE_OPTIONS,
  LANGUAGE_OPTIONS,
  type FontSize,
} from '@/features/settings/lib/themeOptions'

interface GeneralSettingsCardProps {
  fontSize: FontSize
  onFontSizeChange: (value: FontSize) => void
  language: string
  onLanguageChange: (value: string) => void
  notifications: boolean
  onNotificationsChange: (value: boolean) => void
  onSave: () => void
  isSaving: boolean
}

const SELECT_CLASS =
  'px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)]'
const ROW_CLASS =
  'flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]'

export function GeneralSettingsCard({
  fontSize,
  onFontSizeChange,
  language,
  onLanguageChange,
  notifications,
  onNotificationsChange,
  onSave,
  isSaving,
}: GeneralSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geral</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={ROW_CLASS}>
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-[var(--text-secondary)]" />
            <p className="font-medium text-[var(--text)]">Tamanho da fonte</p>
          </div>
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(e.target.value as FontSize)}
            className={SELECT_CLASS}
          >
            {FONT_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={ROW_CLASS}>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[var(--text-secondary)]" />
            <p className="font-medium text-[var(--text)]">Idioma</p>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className={SELECT_CLASS}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={ROW_CLASS}>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
            <p className="font-medium text-[var(--text)]">Notificações</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={(e) => onNotificationsChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-glow)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" />
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
