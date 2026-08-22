import { ScrollView } from 'react-native'
import type { DailyStats } from '@/shared/types'
import { INTENSITY_STEPS, dayIntensity } from '../services/statistics.service'
import * as S from './style'

interface StudyCalendarProps {
  /** Semanas de 7 dias, mais antiga primeiro. */
  weeks: DailyStats[][]
  maxDayMinutes: number
}

/** Grade de contribuicoes: uma coluna por semana, um quadradinho por dia. */
export function StudyCalendar({ weeks, maxDayMinutes }: StudyCalendarProps) {
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <S.Calendar>
          {weeks.map((week, weekIndex) => (
            <S.CalendarWeek key={week[0]?.date ?? weekIndex}>
              {week.map((day) => (
                <S.CalendarCell key={day.date} $intensity={dayIntensity(day.minutes, maxDayMinutes)} />
              ))}
            </S.CalendarWeek>
          ))}
        </S.Calendar>
      </ScrollView>

      <S.Legend>
        <S.LegendText>Menos</S.LegendText>
        {INTENSITY_STEPS.map((intensity) => (
          <S.CalendarCell key={intensity} $intensity={intensity} />
        ))}
        <S.LegendText>Mais</S.LegendText>
      </S.Legend>
    </>
  )
}
