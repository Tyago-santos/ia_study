import Animated from 'react-native-reanimated'
import { styled } from '@/shared/styles'

export const Card = styled.Pressable<{ $borderColor: string }>`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ $borderColor }) => $borderColor};
`

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const CardHeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

/* Rotulo "PERGUNTA"/"RESPOSTA": pequeno e espacado para nao competir com o
   conteudo do cartao. */
/* Palco do flip: a face de tras fica absoluta sobre a da frente, que da a
   altura do bloco (a maior das duas, medida no layout). */
export const FlipStage = styled.View`
  position: relative;
`

export const FlipFace = styled(Animated.View)`
  gap: ${({ theme }) => theme.spacing.sm}px;
  backface-visibility: hidden;
`

export const CardSide = styled.Text`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const CardContent = styled.Text`
  font-size: 15px;
  line-height: 21px;
  color: ${({ theme }) => theme.colors.text};
`

export const CardFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const CardMeta = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
