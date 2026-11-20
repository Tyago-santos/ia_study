import { Ionicons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/shared/hooks/useTheme'
import * as S from './style'

const items = [
  { label: 'Dashboard', route: '/(app)/dashboard', icon: 'grid-outline', featured: false },
  { label: 'Agenda', route: '/(app)/cronograma', icon: 'calendar-outline', featured: false },
  { label: 'Tutor IA', route: '/(app)/ai', icon: 'sparkles', featured: true },
  { label: 'Cards', route: '/(app)/flashcards', icon: 'layers-outline', featured: false },
  { label: 'Perfil', route: '/(app)/perfil', icon: 'person-outline', featured: false },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()

  if (pathname.startsWith('/ai')) return null

  return (
    <S.Container $bottomInset={insets.bottom}>
      {items.map((item) => {
        const routeName = item.route.split('/').at(-1)
        const active = routeName ? pathname.split('/').includes(routeName) : false
        const iconColor = item.featured
          ? colors.onAccent
          : active
            ? colors.accentText
            : colors.textSecondary

        return (
          <S.Tab
            key={item.label}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            onPress={() => router.navigate(item.route)}
          >
            {item.featured ? (
              <S.FeaturedWrap>
                <S.FeaturedHalo />
                <S.FeaturedFrame>
                  <S.FeaturedButton $active={pathname.startsWith('/ai')}>
                    <Ionicons name={item.icon} size={23} color={iconColor} />
                  </S.FeaturedButton>
                </S.FeaturedFrame>
              </S.FeaturedWrap>
            ) : (
              <S.IconWrap $active={active}>
                <Ionicons name={item.icon} size={20} color={iconColor} />
              </S.IconWrap>
            )}
            <S.Label $active={active || item.featured}>{item.label}</S.Label>
          </S.Tab>
        )
      })}
    </S.Container>
  )
}
