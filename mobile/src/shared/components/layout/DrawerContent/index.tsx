import { Ionicons } from '@expo/vector-icons'
import type { DrawerContentComponentProps } from 'expo-router/drawer'
import { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { APP_NAME, LOGO_MARK } from '@/shared/constants/branding'
import { useTheme } from '@/shared/hooks/useTheme'
import { useAuthStore } from '@/shared/store/auth'
import * as S from './style'

/* Equivalente ao `animate-ping` do botao de referencia (web): um anel branco
   que cresce e desaparece em loop atras do ponto solido. */
function AiPulse() {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1)
  }, [progress])

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.75 * (1 - progress.value),
    transform: [{ scale: 1 + progress.value * 1.8 }],
  }))

  return (
    <S.AiPulseWrap>
      <Animated.View style={[{ position: 'absolute' }, ringStyle]}>
        <S.AiPulseRing />
      </Animated.View>
      <S.AiPulseDot />
    </S.AiPulseWrap>
  )
}

type IconName = keyof typeof Ionicons.glyphMap

const menuItems: { name: string; label: string; icon: IconName }[] = [
  { name: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { name: 'cronograma', label: 'Cronograma', icon: 'calendar' },
  { name: 'flashcards', label: 'Flashcards', icon: 'layers' },
  { name: 'quiz', label: 'Quiz', icon: 'help-circle' },
  { name: 'resumos', label: 'Resumos', icon: 'document-text' },
  { name: 'mapas-mentais', label: 'Mapas Mentais', icon: 'git-network' },
  { name: 'biblioteca', label: 'Biblioteca', icon: 'library' },
  { name: 'estatisticas', label: 'Estatísticas', icon: 'bar-chart' },
]

const bottomItems: { name: string; label: string; icon: IconName }[] = [
  { name: 'perfil', label: 'Perfil', icon: 'person' },
  { name: 'configuracoes', label: 'Configurações', icon: 'settings' },
]

export function DrawerContent(props: DrawerContentComponentProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const logout = useAuthStore((s) => s.logout)
  const activeRoute = props.state.routes[props.state.index]?.name

  const renderItem = (item: { name: string; label: string; icon: IconName }) => {
    const isActive = activeRoute === item.name

    return (
      <S.Item
        key={item.name}
        onPress={() => props.navigation.navigate(item.name)}
        $active={isActive}
      >
        <Ionicons
          name={item.icon}
          size={20}
          color={isActive ? colors.accentText : colors.textSecondary}
        />
        <S.ItemLabel $active={isActive}>{item.label}</S.ItemLabel>
        {isActive ? <S.ActiveDot /> : null}
      </S.Item>
    )
  }

  return (
    <S.Container>
      <S.Header $topInset={insets.top}>
        <S.LogoBadge>
          <S.LogoImage source={LOGO_MARK} resizeMode="contain" />
        </S.LogoBadge>
        <S.LogoText>{APP_NAME}</S.LogoText>
      </S.Header>

      <S.Menu>
        <S.AiItemShadow>
          <S.AiItem
            onPress={() => props.navigation.navigate('ai')}
            $active={activeRoute === 'ai'}
          >
            <S.AiIconBadge>
              <Ionicons name="sparkles" size={18} color="#ffffff" />
            </S.AiIconBadge>
            <S.AiTextGroup>
              <S.AiLabel numberOfLines={1}>Chat IA</S.AiLabel>
              <S.AiSubLabel numberOfLines={1}>Assistente de IA</S.AiSubLabel>
            </S.AiTextGroup>
            <AiPulse />
          </S.AiItem>
        </S.AiItemShadow>

        <S.SectionLabel>Menu</S.SectionLabel>

        {menuItems.map(renderItem)}
      </S.Menu>

      <S.Footer $bottomInset={insets.bottom}>
        {bottomItems.map((item) => {
          const isActive = activeRoute === item.name

          return (
            <S.Item
              key={item.name}
              onPress={() => props.navigation.navigate(item.name)}
              $active={isActive}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? colors.accentText : colors.textSecondary}
              />
              <S.ItemLabel $active={isActive}>{item.label}</S.ItemLabel>
            </S.Item>
          )
        })}

        <S.Item onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <S.ItemLabel $danger>Sair</S.ItemLabel>
        </S.Item>
      </S.Footer>
    </S.Container>
  )
}
