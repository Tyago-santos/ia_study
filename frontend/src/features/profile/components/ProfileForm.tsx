import { useEffect, useState } from 'react'
import { Save, User as UserIcon } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/components/ui'
import type { User } from '@/shared/types'
import { useUpdateProfile } from '@/features/profile/hooks/useProfile'

interface ProfileFormProps {
  user: User | undefined
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setBio(user.bio ?? '')
    }
  }, [user])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-20 h-20 shrink-0 rounded-full bg-primary-500/15 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-primary-300" />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate">{user?.name}</CardTitle>
            <p className="text-sm text-[var(--text-secondary)] truncate">{user?.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" value={user?.email ?? ''} disabled />
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Bio</label>
          <textarea
            className="w-full h-24 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => updateProfile.mutate({ name, bio })}
            disabled={updateProfile.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {updateProfile.isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
