import type { Ionicons } from '@expo/vector-icons'

type IoniconName = keyof typeof Ionicons.glyphMap

/**
 * O frontend web guarda o nome do icone do lucide-react no campo `subject.icon`.
 * Aqui traduzimos esses nomes para os equivalentes mais proximos no Ionicons,
 * que e o set ja usado no app, para nao precisar mudar os dados compartilhados.
 */
const SUBJECT_ICONS: Record<string, IoniconName> = {
  Calculator: 'calculator',
  Atom: 'nuclear',
  Code: 'code-slash',
  FlaskConical: 'flask',
  BookOpen: 'book',
  Globe: 'globe',
  Landmark: 'business',
  Languages: 'language',
  Music: 'musical-notes',
  Palette: 'color-palette',
  Dna: 'git-branch',
}

export const SUBJECT_ICON_OPTIONS = Object.keys(SUBJECT_ICONS)

export function getSubjectIcon(icon?: string): IoniconName {
  return (icon && SUBJECT_ICONS[icon]) || 'book'
}
