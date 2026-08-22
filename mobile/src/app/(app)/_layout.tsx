import { Redirect } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { useReminders } from '@/features/notifications/hooks/useReminders'
import { DrawerContent } from '@/shared/components/layout/DrawerContent'
import { useTheme } from '@/shared/hooks/useTheme'
import { useAuthStore } from '@/shared/store/auth'

/** Mesma ordem e nomes do menu lateral do frontend web. */
const SCREENS = [
  { name: 'dashboard', title: 'Dashboard' },
  { name: 'cronograma', title: 'Cronograma' },
  { name: 'flashcards', title: 'Flashcards' },
  { name: 'quiz', title: 'Quiz' },
  { name: 'resumos', title: 'Resumos' },
  { name: 'mapas-mentais', title: 'Mapas Mentais' },
  { name: 'biblioteca', title: 'Biblioteca' },
  { name: 'estatisticas', title: 'Estatísticas' },
  { name: 'ai', title: 'Chat IA' },
  { name: 'perfil', title: 'Perfil' },
  { name: 'configuracoes', title: 'Configurações' },
]

export default function AppLayout() {
  const token = useAuthStore((s) => s.token)
  const { colors } = useTheme()

  // Mantem os lembretes do sistema em dia enquanto o app estiver autenticado.
  useReminders()

  if (!token) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        drawerStyle: { width: 280 },
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      {SCREENS.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={{ title: screen.title, drawerLabel: screen.title }}
        />
      ))}
    </Drawer>
  )
}
