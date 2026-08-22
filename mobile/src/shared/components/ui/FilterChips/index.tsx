import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

export interface ChipOption {
  value: string | null
  label: string
  color?: string
}

interface FilterChipsProps {
  options: ChipOption[]
  value: string | null
  onChange: (value: string | null) => void
}

export function FilterChips({ options, value, onChange }: FilterChipsProps) {
  const { colors } = useTheme()

  return (
    <S.Row>
      {options.map((option) => {
        const isActive = option.value === value
        const tint = option.color ?? colors.accent

        return (
          <S.Chip
            key={option.value ?? 'all'}
            onPress={() => onChange(option.value)}
            $tint={tint}
            $active={isActive}
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : null)}
          >
            <S.ChipLabel $tint={tint} $active={isActive} numberOfLines={1}>
              {option.label}
            </S.ChipLabel>
          </S.Chip>
        )
      })}
    </S.Row>
  )
}
