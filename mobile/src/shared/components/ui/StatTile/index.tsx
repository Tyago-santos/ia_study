import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

interface StatTileProps {
  label: string
  value: string
  icon: keyof typeof Ionicons.glyphMap
  /** Cor do badge do icone; cai no verde do tema quando ausente. */
  tint?: string
  /** Variacao percentual — positiva sobe em verde, negativa desce em vermelho. */
  trend?: number
}

export function StatTile({ label, value, icon, tint, trend }: StatTileProps) {
  const { colors } = useTheme()
  const badgeColor = tint ?? colors.accent
  const trendColor = (trend ?? 0) >= 0 ? colors.accentText : colors.danger

  return (
    <S.Container>
      <S.TopRow>
        <S.IconBadge $tint={badgeColor}>
          <Ionicons name={icon} size={18} color={badgeColor} />
        </S.IconBadge>

        {trend !== undefined ? (
          <S.Trend>
            <Ionicons
              name={trend >= 0 ? 'trending-up' : 'trending-down'}
              size={13}
              color={trendColor}
            />
            <S.TrendText $tint={trendColor}>
              {trend >= 0 ? '+' : ''}
              {trend}%
            </S.TrendText>
          </S.Trend>
        ) : null}
      </S.TopRow>

      <S.Value>{value}</S.Value>
      <S.Label>{label}</S.Label>
    </S.Container>
  )
}
