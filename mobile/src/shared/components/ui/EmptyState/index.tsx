import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap
  title: string
  description?: string
}

export function EmptyState({ icon = 'file-tray-outline', title, description }: EmptyStateProps) {
  const { colors } = useTheme()

  return (
    <S.Container>
      <Ionicons name={icon} size={44} color={colors.textSecondary} />
      <S.Title>{title}</S.Title>
      {description ? <S.Description>{description}</S.Description> : null}
    </S.Container>
  )
}
