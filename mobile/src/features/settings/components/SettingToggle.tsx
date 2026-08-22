import { Switch } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'
import type { NotificationToggle } from '../services/settings.service'
import * as S from './style'

interface SettingToggleProps {
  toggle: NotificationToggle
  /** Desenha a linha divisoria acima; falso no primeiro item da lista. */
  divided?: boolean
}

export function SettingToggle({ toggle, divided }: SettingToggleProps) {
  const { colors } = useTheme()

  return (
    <S.SettingRow $divided={divided}>
      <S.SettingInfo>
        <S.SettingName>{toggle.label}</S.SettingName>
        <S.SettingHint>{toggle.hint}</S.SettingHint>
      </S.SettingInfo>
      <Switch
        value={toggle.value}
        onValueChange={toggle.set}
        trackColor={{ true: colors.accent, false: colors.border }}
      />
    </S.SettingRow>
  )
}
