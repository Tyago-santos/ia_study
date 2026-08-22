import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonBlock, SkeletonCard } from '@/shared/components/ui/Skeleton'
import { StatTile } from '@/shared/components/ui/StatTile'
import { Tints } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatMinutes } from '@/shared/lib/format'
import { StudyCalendar } from '../components/StudyCalendar'
import { useStatistics } from '../hooks/useStatistics'
import { subjectSharePercent } from '../services/statistics.service'
import * as S from './style'

export function StatisticsPage() {
  const { colors } = useTheme()
  const {
    isLoading,
    dashboard,
    subjectStats,
    quizStats,
    flashcardStats,
    pomodoroStats,
    subjects,
    weeks,
    maxDayMinutes,
    subjectMinutesTotal,
  } = useStatistics()

  if (isLoading) {
    return (
      <Screen scroll>
        <PageHeader title="Estatísticas" subtitle="Carregando..." />
        <S.Tiles>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} width="47%" height={78} radius={16} />
          ))}
        </S.Tiles>
        <SkeletonCard lines={3} style={{ marginTop: 16, marginBottom: 12 }} />
        <SkeletonCard lines={3} />
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <PageHeader title="Estatísticas" subtitle="Acompanhe sua evolução detalhada" />

      <S.Tiles>
        <StatTile
          label="Tempo total"
          value={formatMinutes(dashboard?.monthMinutes ?? 0)}
          icon="time"
          tint={Tints.cyan}
        />
        <StatTile
          label="Pomodoros"
          value={`${pomodoroStats?.totalPomodoros ?? 0}`}
          icon="timer"
          tint={Tints.red}
        />
        <StatTile
          label="Flashcards"
          value={`${flashcardStats?.total ?? 0}`}
          icon="layers"
          tint={Tints.violet}
        />
        <StatTile
          label="Média quiz"
          value={`${quizStats?.average ?? 0}%`}
          icon="stats-chart"
          tint={Tints.emerald}
        />
      </S.Tiles>

      <S.Section>
        <SectionCard title="Tempo por matéria">
          {subjectStats.map((stat) => {
            const color = subjects.find((s) => s.id === stat.subjectId)?.color ?? colors.accent
            const pct = subjectSharePercent(stat.totalMinutes, subjectMinutesTotal)

            return (
              <S.SubjectRow key={stat.subjectId}>
                <S.SubjectHeader>
                  <S.SubjectName>{stat.subjectName}</S.SubjectName>
                  <S.SubjectValue>
                    {formatMinutes(stat.totalMinutes)} · {stat.sessions} sessões
                  </S.SubjectValue>
                </S.SubjectHeader>
                <ProgressBar value={pct} color={color} height={6} />
              </S.SubjectRow>
            )
          })}
        </SectionCard>
      </S.Section>

      <S.Section>
        <SectionCard title="Calendário de estudos">
          <StudyCalendar weeks={weeks} maxDayMinutes={maxDayMinutes} />
        </SectionCard>
      </S.Section>

      <S.Section>
        <SectionCard title="Desempenho nos quizzes">
          <S.QuizRow>
            <S.QuizStat>
              <S.QuizValue $highlight>{quizStats?.average ?? 0}%</S.QuizValue>
              <S.QuizLabel>média</S.QuizLabel>
            </S.QuizStat>
            <S.QuizStat>
              <S.QuizValue>{quizStats?.completed ?? 0}</S.QuizValue>
              <S.QuizLabel>concluídos</S.QuizLabel>
            </S.QuizStat>
            <S.QuizStat>
              <S.QuizValue>{quizStats?.total ?? 0}</S.QuizValue>
              <S.QuizLabel>criados</S.QuizLabel>
            </S.QuizStat>
          </S.QuizRow>
        </SectionCard>
      </S.Section>
    </Screen>
  )
}
