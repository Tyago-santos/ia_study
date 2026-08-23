import { ErrorState, StatsSkeleton } from '@/shared/components/ui'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { ProfileForm } from '../components/ProfileForm'
import { ProfileStats } from '../components/ProfileStats'

export function ProfilePage() {
  const { data: user, isLoading, error, refetch } = useProfile()

  if (error) {
    return <ErrorState message="Erro ao carregar perfil" onRetry={refetch} />
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-[var(--bg-secondary)] rounded animate-pulse" />
        <StatsSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Perfil</h1>
        <p className="text-[var(--text-secondary)]">Gerencie suas informações pessoais</p>
      </div>

      <ProfileForm user={user} />
      <ProfileStats createdAt={user?.createdAt} />
    </div>
  )
}
