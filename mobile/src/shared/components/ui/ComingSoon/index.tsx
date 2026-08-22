import { Screen } from '@/shared/components/ui/Screen'
import * as S from './style'

export function ComingSoon({ title }: { title: string }) {
  return (
    <Screen centered>
      <S.Title>{title}</S.Title>
      <S.Subtitle>Em breve</S.Subtitle>
    </Screen>
  )
}
