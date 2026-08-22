import type { PropsWithChildren } from 'react'
import type { ViewStyle } from 'react-native'
import * as S from './style'

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <S.Container style={style}>{children}</S.Container>
}
