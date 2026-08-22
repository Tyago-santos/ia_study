import { Ionicons } from '@expo/vector-icons'
import { Button } from '@/shared/components/ui/Button'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonBlock } from '@/shared/components/ui/Skeleton'
import { StatTile } from '@/shared/components/ui/StatTile'
import { Tints } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDate, formatMinutes } from '@/shared/lib/format'
import { useProfile } from '../hooks/useProfile'
import * as S from './style'

export function ProfilePage() {
  const { colors } = useTheme()
  const { isLoading, user, logout, stats, pomodoroStats, flashcardStats, initials } = useProfile()

  return (
    <Screen scroll>
      <PageHeader title="Perfil" subtitle="Gerencie suas informações pessoais" />

      <S.Section>
        <SectionCard>
          <S.Identity>
            <S.Avatar>
              <S.AvatarText>{initials}</S.AvatarText>
            </S.Avatar>

            <S.IdentityInfo>
              <S.Name>{user?.name}</S.Name>
              <S.Email>{user?.email}</S.Email>
              {user?.createdAt ? (
                <S.MemberSince>
                  <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                  <S.MemberSinceText>Desde {formatDate(user.createdAt)}</S.MemberSinceText>
                </S.MemberSince>
              ) : null}
            </S.IdentityInfo>
          </S.Identity>
        </SectionCard>
      </S.Section>

      {isLoading ? (
        <S.Tiles>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} width="47%" height={78} radius={16} />
          ))}
        </S.Tiles>
      ) : (
        <S.Tiles>
          <StatTile
            label="Tempo total"
            value={formatMinutes(stats?.monthMinutes ?? 0)}
            icon="time"
            tint={Tints.cyan}
          />
          <StatTile
            label="Ofensiva"
            value={`${stats?.streak ?? 0} dias`}
            icon="flame"
            tint={Tints.amber}
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
        </S.Tiles>
      )}

      <S.Section>
        <Button title="Sair da conta" variant="secondary" onPress={logout} />
      </S.Section>
    </Screen>
  )
}
