import { Ionicons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/** "AAAA-MM-DD" sem passar por UTC, que deslocaria o dia em fusos negativos. */
function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

interface CalendarPickerProps {
  /** Data selecionada em "AAAA-MM-DD"; vazio = nenhuma. */
  value: string
  onChange: (date: string) => void
}

export function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const { colors } = useTheme()

  const selected = value ? new Date(`${value}T12:00:00`) : null
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const base = selected ?? new Date()
    return { year: base.getFullYear(), month: base.getMonth() }
  })

  const todayISO = useMemo(() => {
    const now = new Date()
    return toISODate(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  /**
   * Celulas do mes: os vazios do inicio alinham o dia 1 na coluna certa da
   * semana, senao o grid inteiro sai deslocado.
   */
  const cells = useMemo(() => {
    const { year, month } = visibleMonth
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const result: (number | null)[] = Array(firstWeekday).fill(null)
    for (let day = 1; day <= daysInMonth; day++) result.push(day)
    return result
  }, [visibleMonth])

  const shiftMonth = (delta: number) => {
    setVisibleMonth(({ year, month }) => {
      const next = month + delta
      if (next < 0) return { year: year - 1, month: 11 }
      if (next > 11) return { year: year + 1, month: 0 }
      return { year, month: next }
    })
  }

  return (
    <S.Container>
      <S.Header>
        <Pressable onPress={() => shiftMonth(-1)} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
        </Pressable>

        <S.MonthLabel>
          {MONTHS[visibleMonth.month]} {visibleMonth.year}
        </S.MonthLabel>

        <Pressable onPress={() => shiftMonth(1)} hitSlop={8}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      </S.Header>

      <S.WeekRow>
        {WEEKDAYS.map((label, index) => (
          <S.Weekday key={`${label}-${index}`}>{label}</S.Weekday>
        ))}
      </S.WeekRow>

      <S.Grid>
        {cells.map((day, index) => {
          if (day === null) {
            return <S.EmptyCell key={`empty-${index}`} />
          }

          const iso = toISODate(visibleMonth.year, visibleMonth.month, day)
          const isSelected = iso === value
          const isToday = iso === todayISO

          return (
            <S.Cell key={iso} onPress={() => onChange(iso)} $selected={isSelected} $today={isToday}>
              <S.Day $selected={isSelected} $today={isToday}>
                {day}
              </S.Day>
            </S.Cell>
          )
        })}
      </S.Grid>
    </S.Container>
  )
}
