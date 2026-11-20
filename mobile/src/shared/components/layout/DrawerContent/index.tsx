import { Ionicons } from '@expo/vector-icons'
import type { DrawerContentComponentProps } from 'expo-router/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { APP_NAME, LOGO_MARK } from '@/shared/constants/branding'
import { useTheme } from '@/shared/hooks/useTheme'
import { useAuthStore } from '@/shared/store/auth'
import * as S from './style'

type IconName = keyof typeof Ionicons.glyphMap

const menuItems: { name: string; label: string; icon: IconName }[] = [
  { name: 'quiz', label: 'Quiz', icon: 'help-circle' },
  { name: 'resumos', label: 'Resumos', icon: 'document-text' },
  { name: 'mapas-mentais', label: 'Mapas Mentais', icon: 'git-network' },
  { name: 'biblioteca', label: 'Biblioteca', icon: 'library' },
  { name: 'estatisticas', label: 'Estatísticas', icon: 'bar-chart' },
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
        <S.SectionLabel>Outras telas</S.SectionLabel>

        {menuItems.map(renderItem)}
      </S.Menu>

      <S.Footer $bottomInset={insets.bottom}>
        <S.Item onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <S.ItemLabel $danger>Sair</S.ItemLabel>
        </S.Item>
      </S.Footer>
    </S.Container>
  )
}
