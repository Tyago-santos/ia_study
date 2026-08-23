import {
  Calculator,
  Atom,
  Code,
  FlaskConical,
  BookOpen,
  Globe,
  Landmark,
  Languages,
  Music,
  Palette,
  Dna,
  type LucideIcon,
} from 'lucide-react'

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  Calculator,
  Atom,
  Code,
  FlaskConical,
  BookOpen,
  Globe,
  Landmark,
  Languages,
  Music,
  Palette,
  Dna,
}

export const SUBJECT_ICON_OPTIONS = Object.keys(SUBJECT_ICONS)

export function getSubjectIcon(icon?: string): LucideIcon {
  return (icon && SUBJECT_ICONS[icon]) || BookOpen
}
