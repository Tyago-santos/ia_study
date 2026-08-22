import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { Badge } from '@/shared/components/ui/Badge'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDate } from '@/shared/lib/format'
import type { Subject, Summary } from '@/shared/types'
import { SOURCE_ICONS } from '../services/summaries.service'
import * as S from './style'

interface SummaryCardProps {
  summary: Summary
  subject?: Subject
  /** Aberto mostra o texto inteiro; fechado corta em tres linhas. */
  expanded: boolean
  onToggle: () => void
  onRemove: () => void
}

export function SummaryCard({ summary, subject, expanded, onToggle, onRemove }: SummaryCardProps) {
  const { colors } = useTheme()
  const tint = subject?.color ?? colors.accent

  return (
    <S.Card onPress={onToggle}>
      <S.CardHeader>
        <S.SourceIcon $color={tint}>
          <Ionicons name={SOURCE_ICONS[summary.sourceType]} size={18} color={tint} />
        </S.SourceIcon>

        <S.CardHeaderInfo>
          <Badge label={subject?.name ?? 'Sem matéria'} color={subject?.color} />
          <S.CardTitle>{summary.title}</S.CardTitle>
        </S.CardHeaderInfo>

        <Pressable onPress={onRemove} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      </S.CardHeader>

      <S.CardContent numberOfLines={expanded ? undefined : 3}>{summary.content}</S.CardContent>

      <S.CardFooter>
        <S.CardMeta>{formatDate(summary.createdAt)}</S.CardMeta>
        <S.CardToggle>{expanded ? 'Recolher' : 'Ler tudo'}</S.CardToggle>
      </S.CardFooter>
    </S.Card>
  )
}
