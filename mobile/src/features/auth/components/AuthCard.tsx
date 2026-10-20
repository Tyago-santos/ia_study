import type { PropsWithChildren } from 'react'
import { Card } from '@/shared/components/ui/Card'
import { Screen } from '@/shared/components/ui/Screen'
import { APP_NAME, LOGO_MARK } from '@/shared/constants/branding'
import { Spacing } from '@/shared/constants/theme'
import * as S from './style'

interface AuthCardProps extends PropsWithChildren {
  title: string
  subtitle: string
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  // O nome e' uma string unica de branding; aqui so' separamos a ultima palavra
  // para dar a cor de destaque da marca. O texto renderizado nao muda.
  const nameParts = APP_NAME.split(' ')
  const brandHead = nameParts.slice(0, -1).join(' ')
  const brandTail = nameParts[nameParts.length - 1] ?? ''

  return (
    <Screen scroll centered safeTop>
      <S.Brand>
        <S.LogoBadge>
          <S.LogoImage source={LOGO_MARK} resizeMode="contain" />
        </S.LogoBadge>
        <S.BrandName>
          {brandHead} <S.BrandAccent>{brandTail}</S.BrandAccent>
        </S.BrandName>
      </S.Brand>

      <Card style={{ gap: Spacing.md }}>
        <S.CardTitle>{title}</S.CardTitle>
        <S.CardSubtitle>{subtitle}</S.CardSubtitle>
        {children}
      </Card>
    </Screen>
  )
}
