import { Ionicons } from '@expo/vector-icons'
import * as S from './style'

interface ChatBannerProps {
  icon: keyof typeof Ionicons.glyphMap
  tint: string
  message: string
}

/** Faixa de aviso entre a conversa e o campo de texto. */
export function ChatBanner({ icon, tint, message }: ChatBannerProps) {
  return (
    <S.Banner $tint={tint}>
      <Ionicons name={icon} size={15} color={tint} />
      <S.BannerText $tint={tint}>{message}</S.BannerText>
    </S.Banner>
  )
}
