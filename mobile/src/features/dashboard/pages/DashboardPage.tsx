import { Ionicons } from '@expo/vector-icons'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonBlock, SkeletonCard } from '@/shared/components/ui/Skeleton'
import { StatTile } from '@/shared/components/ui/StatTile'
import { Tints } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatMinutes, formatRelative } from '@/shared/lib/format'
import { PomodoroWidget } from '@/features/pomodoro/components/PomodoroWidget'
import type { Activity } from '@/shared/types'
import { WeeklyPlanner } from '../components/WeeklyPlanner'
import { useDashboardData } from '../hooks/useDashboardData'
import { barHeight, subjectSharePercent } from '../services/dashboard.service'
import * as S from './style'

const ACTIVITY_ICONS: Record<Activity['type'], keyof typeof Ionicons.glyphMap> = {
  pomodoro: 'timer',
  quiz: 'help-circle',
  flashcard: 'layers',
  summary: 'document-text',
  subject: 'book',
  topic: 'checkmark-circle',
}

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export function DashboardPage() {
  const { colors } = useTheme()
  const {
    isLoading,
    user,
    stats,
    weekly,
    subjectStats,
    activities,
    subjects,
    maxDayMinutes,
    goalProgress,
    subjectMinutesTotal,
  } = useDashboardData()

  const subjectColor = (id: string) => subjects.find((s) => s.id === id)?.color ?? colors.accent

  if (isLoading) {
    return (
      <Screen scroll>
        <S.Intro>
          <SkeletonBlock width="60%" height={24} />
          <SkeletonBlock width="80%" height={13} style={{ marginTop: 6 }} />
        </S.Intro>

        <SkeletonBlock height={72} radius={16} style={{ marginBottom: 16 }} />

        <S.Tiles>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} width="47%" height={78} radius={16} />
          ))}
        </S.Tiles>

        <S.Section>
          <SkeletonCard lines={3} />
        </S.Section>
        <S.Section>
          <SkeletonCard lines={3} />
        </S.Section>
        <S.Section>
          <SkeletonCard lines={4} />
        </S.Section>
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <S.Intro>
        <S.Title>Olá{user ? `, ${user.name.split(' ')[0]}` : ''}!</S.Title>
        <S.Subtitle>Acompanhe seu progresso de estudos</S.Subtitle>
      </S.Intro>

      <S.Pomodoro>
        <PomodoroWidget />
      </S.Pomodoro>

      <S.Tiles>
        <StatTile
          label="Horas hoje"
          value={formatMinutes(stats?.todayMinutes ?? 0)}
          icon="time"
          tint={Tints.cyan}
        />
        <StatTile
          label="Esta semana"
          value={formatMinutes(stats?.weekMinutes ?? 0)}
          icon="trending-up"
          tint={Tints.emerald}
        />
        <StatTile
          label="Ofensiva"
          value={`${stats?.streak ?? 0} dias`}
          icon="flame"
          tint={Tints.amber}
        />
        <StatTile
          label="Meta semanal"
          value={`${goalProgress}%`}
          icon="flag"
          tint={colors.accent}
        />
      </S.Tiles>

      <S.Section>
        <WeeklyPlanner />
      </S.Section>

      <S.Section>
        <SectionCard
          title="Atividade da semana"
          action={<S.Hint>{formatMinutes(stats?.weekMinutes ?? 0)}</S.Hint>}
        >
          <S.Chart>
            {weekly.map((day) => {
              const weekday = WEEKDAY_LABELS[new Date(`${day.date}T00:00:00`).getDay()]

              return (
                <S.ChartColumn key={day.date}>
                  <S.ChartValue>{day.minutes}</S.ChartValue>
                  <S.Bar $height={barHeight(day.minutes, maxDayMinutes)} />
                  <S.ChartLabel>{weekday}</S.ChartLabel>
                </S.ChartColumn>
              )
            })}
          </S.Chart>
        </SectionCard>
      </S.Section>

      <S.Section>
        <SectionCard
          title="Distribuição por matéria"
          action={<S.Hint>{formatMinutes(subjectMinutesTotal)}</S.Hint>}
        >
          {subjectStats.map((stat) => {
            const pct = subjectSharePercent(stat.totalMinutes, subjectMinutesTotal)

            return (
              <S.DistributionRow key={stat.subjectId}>
                <S.DistributionHeader>
                  <S.DistributionName>{stat.subjectName}</S.DistributionName>
                  <S.DistributionValue>
                    {formatMinutes(stat.totalMinutes)} · {pct}%
                  </S.DistributionValue>
                </S.DistributionHeader>
                <ProgressBar value={pct} color={subjectColor(stat.subjectId)} height={6} />
              </S.DistributionRow>
            )
          })}
        </SectionCard>
      </S.Section>

      <S.Section>
        <SectionCard title="Atividade recente">
          {activities.length > 0 ? (
            activities.slice(0, 6).map((activity) => (
              <S.ActivityRow key={activity.id}>
                <S.ActivityIcon $color={subjectColor(activity.subjectId)}>
                  <Ionicons
                    name={ACTIVITY_ICONS[activity.type]}
                    size={16}
                    color={subjectColor(activity.subjectId)}
                  />
                </S.ActivityIcon>

                <S.ActivityInfo>
                  <S.ActivityTitle numberOfLines={1}>{activity.title}</S.ActivityTitle>
                  <S.ActivityDescription numberOfLines={1}>
                    {activity.description}
                  </S.ActivityDescription>
                </S.ActivityInfo>

                <S.ActivityTime>{formatRelative(activity.createdAt)}</S.ActivityTime>
              </S.ActivityRow>
            ))
          ) : (
            <EmptyState title="Sem atividade ainda" description="Estude para preencher aqui." />
          )}
        </SectionCard>
      </S.Section>
    </Screen>
  )
}
