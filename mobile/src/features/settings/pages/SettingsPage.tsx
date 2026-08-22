import { Ionicons } from '@expo/vector-icons'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { useTheme } from '@/shared/hooks/useTheme'
import { REMINDER_LEAD_OPTIONS } from '@/shared/store/notificationSettings'
import * as C from '../components/style'
import { SettingToggle } from '../components/SettingToggle'
import { useSettings } from '../hooks/useSettings'
import { FONT_SIZES, THEME_OPTIONS, leadLabel } from '../services/settings.service'
import * as S from './style'

export function SettingsPage() {
  const { colors } = useTheme()
  const { theme, setTheme, settings, updateSettings, notifications, notificationToggles } =
    useSettings()

  return (
    <Screen scroll>
      <PageHeader title="Configurações" subtitle="Personalize sua experiência" />

      <S.Section>
        <SectionCard title="Aparência">
          <C.OptionRow>
            {THEME_OPTIONS.map((option) => {
              const isActive = theme === option.value

              return (
                <C.Option
                  key={option.value}
                  onPress={() => setTheme(option.value)}
                  $active={isActive}
                  $tall
                >
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={isActive ? colors.accentText : colors.textSecondary}
                  />
                  <C.OptionLabel $active={isActive}>{option.label}</C.OptionLabel>
                </C.Option>
              )
            })}
          </C.OptionRow>
        </SectionCard>
      </S.Section>

      <S.Section>
        <SectionCard title="Tamanho da fonte">
          <C.OptionRow>
            {FONT_SIZES.map((option) => {
              const isActive = settings?.fontSize === option.value

              return (
                <C.Option
                  key={option.value}
                  onPress={() => updateSettings.mutate({ fontSize: option.value })}
                  $active={isActive}
                >
                  <C.OptionLabel $active={isActive}>{option.label}</C.OptionLabel>
                </C.Option>
              )
            })}
          </C.OptionRow>
        </SectionCard>
      </S.Section>

      <S.Section>
        <SectionCard title="Notificações">
          {notificationToggles.map((toggle, index) => (
            <SettingToggle key={toggle.key} toggle={toggle} divided={index > 0} />
          ))}

          <S.LeadBlock>
            <C.SettingName>Avisar com antecedência</C.SettingName>
            <FilterChips
              value={String(notifications.leadMinutes)}
              onChange={(value) => notifications.setLeadMinutes(Number(value))}
              options={REMINDER_LEAD_OPTIONS.map((minutes) => ({
                value: String(minutes),
                label: leadLabel(minutes),
              }))}
            />
          </S.LeadBlock>
        </SectionCard>
      </S.Section>

      <S.Section>
        <SectionCard title="Geral">
          <C.SettingRow>
            <C.SettingInfo>
              <C.SettingName>Idioma</C.SettingName>
              <C.SettingHint>{settings?.language ?? 'pt-BR'}</C.SettingHint>
            </C.SettingInfo>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </C.SettingRow>
        </SectionCard>
      </S.Section>
    </Screen>
  )
}
