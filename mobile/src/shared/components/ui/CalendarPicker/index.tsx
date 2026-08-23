import { Calendar, LocaleConfig } from 'react-native-calendars'
import { useTheme } from '@/shared/hooks/useTheme'

LocaleConfig.locales['pt-br'] = {
  monthNames: [
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
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
}
LocaleConfig.defaultLocale = 'pt-br'

interface CalendarPickerProps {
  /** Data selecionada em "AAAA-MM-DD"; vazio = nenhuma. */
  value: string
  onChange: (date: string) => void
}

export function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const { colors } = useTheme()

  return (
    <Calendar
      current={value || undefined}
      onDayPress={(day) => onChange(day.dateString)}
      markedDates={
        value ? { [value]: { selected: true, selectedColor: colors.accent } } : undefined
      }
      style={{
        borderWidth: 1,
        borderRadius: 12,
        borderColor: colors.border,
        backgroundColor: colors.card,
      }}
      theme={{
        backgroundColor: colors.card,
        calendarBackground: colors.card,
        textSectionTitleColor: colors.textSecondary,
        dayTextColor: colors.text,
        textDisabledColor: colors.textSecondary,
        monthTextColor: colors.text,
        arrowColor: colors.textSecondary,
        todayTextColor: colors.accentText,
        selectedDayBackgroundColor: colors.accent,
        selectedDayTextColor: colors.onAccent,
        textDayFontWeight: '500',
        textMonthFontWeight: '700',
        textDayHeaderFontWeight: '700',
        textDayFontSize: 13,
        textMonthFontSize: 14,
        textDayHeaderFontSize: 11,
      }}
    />
  )
}
