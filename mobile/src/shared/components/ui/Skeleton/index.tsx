import { useEffect } from 'react'
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from '@/shared/hooks/useTheme'
import { Radius } from '@/shared/constants/theme'

interface SkeletonBlockProps {
  width?: number | `${number}%`
  height?: number
  radius?: number
  style?: object
}

/** Bloco cinza pulsando; a unidade basica de todo skeleton da tela. */
export function SkeletonBlock({
  width = '100%',
  height = 16,
  radius = Radius.sm,
  style,
}: SkeletonBlockProps) {
  const { colors } = useTheme()
  const opacity = useSharedValue(0.5)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Reanimated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.border },
        animatedStyle,
        style,
      ]}
    />
  )
}

/** Skeleton de um card com titulo e algumas linhas — o formato mais comum das telas. */
export function SkeletonCard({ lines = 2, style }: { lines?: number; style?: object }) {
  return (
    <SkeletonStack gap={10} style={[{ padding: 16, borderRadius: Radius.lg }, style]}>
      <SkeletonBlock width="50%" height={14} />
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBlock key={index} height={12} />
      ))}
    </SkeletonStack>
  )
}

interface SkeletonStackProps {
  gap?: number
  style?: object
  children: React.ReactNode
}

/** Empilha blocos verticalmente; base de qualquer layout de skeleton composto. */
export function SkeletonStack({ gap = 12, style, children }: SkeletonStackProps) {
  const { colors } = useTheme()

  return (
    <Reanimated.View
      style={[
        { gap, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
        style,
      ]}
    >
      {children}
    </Reanimated.View>
  )
}
