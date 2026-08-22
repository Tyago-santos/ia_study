import { Colors } from '@/shared/constants/theme'
import { useThemeStore } from '@/shared/store/theme'

export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  return { theme, colors: Colors[theme] }
}
