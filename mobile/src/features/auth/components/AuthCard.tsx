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
  return (
    <Screen scroll centered safeTop>
      <S.Brand>
        <S.LogoBadge>
          <S.LogoImage source={LOGO_MARK} resizeMode="contain" />
        </S.LogoBadge>
        <S.BrandName>{APP_NAME}</S.BrandName>
      </S.Brand>

      <Card style={{ gap: Spacing.md }}>
        <S.CardTitle>{title}</S.CardTitle>
        <S.CardSubtitle>{subtitle}</S.CardSubtitle>
        {children}
      </Card>
    </Screen>
  )
}
