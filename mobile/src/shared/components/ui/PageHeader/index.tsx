import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

export function PageHeader({ title, subtitle, actionLabel, onAction }: PageHeaderProps) {
  const { colors } = useTheme()

  return (
    <S.Container>
      <S.TitleBlock>
        <S.Title>{title}</S.Title>
        {subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}
      </S.TitleBlock>

      {actionLabel && onAction ? (
        <S.Action
          onPress={onAction}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : null)}
        >
          <Ionicons name="add" size={16} color={colors.onAccent} />
          <S.ActionLabel>{actionLabel}</S.ActionLabel>
        </S.Action>
      ) : null}
    </S.Container>
  )
}
