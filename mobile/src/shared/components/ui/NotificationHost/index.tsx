import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Pressable } from 'react-native'
import { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Spacing } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import {
  type AppNotification,
  type NotificationKind,
  useNotificationStore,
} from '@/shared/store/notifications'
import * as S from './style'

const KIND_ICONS: Record<NotificationKind, keyof typeof Ionicons.glyphMap> = {
  info: 'information-circle',
  success: 'checkmark-circle',
  warning: 'alert-circle',
  error: 'close-circle',
}

/**
 * Camada de notificacoes do app. Fica sobre todas as telas, montada uma unica
 * vez no layout raiz — por isso um `pointerEvents` seletivo: o container ocupa
 * o topo inteiro, mas so os banners recebem toque.
 */
export function NotificationHost() {
  const insets = useSafeAreaInsets()
  const items = useNotificationStore((s) => s.items)

  if (items.length === 0) return null

  return (
    <S.Host $top={insets.top + Spacing.sm} pointerEvents="box-none">
      {items.map((notification) => (
        <NotificationBanner key={notification.id} notification={notification} />
      ))}
    </S.Host>
  )
}

function NotificationBanner({ notification }: { notification: AppNotification }) {
  const { colors } = useTheme()
  const dismiss = useNotificationStore((s) => s.dismiss)

  const tint =
    notification.kind === 'success'
      ? colors.accent
      : notification.kind === 'warning'
        ? colors.warning
        : notification.kind === 'error'
          ? colors.danger
          : colors.textSecondary

  useEffect(() => {
    if (notification.duration <= 0) return

    const timeout = setTimeout(() => dismiss(notification.id), notification.duration)
    return () => clearTimeout(timeout)
  }, [notification.id, notification.duration, dismiss])

  return (
    <S.Banner
      entering={FadeInUp}
      exiting={FadeOutUp}
      layout={LinearTransition}
      $tint={tint}
    >
      <Ionicons name={KIND_ICONS[notification.kind]} size={20} color={tint} />

      <S.Content>
        <S.Title numberOfLines={1}>{notification.title}</S.Title>
        {notification.message ? (
          <S.Message numberOfLines={2}>{notification.message}</S.Message>
        ) : null}
      </S.Content>

      <Pressable onPress={() => dismiss(notification.id)} hitSlop={8}>
        <Ionicons name="close" size={17} color={colors.textSecondary} />
      </Pressable>
    </S.Banner>
  )
}
