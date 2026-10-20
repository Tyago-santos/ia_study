import { styled } from '@/shared/styles'

export const Section = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

/* Bloco do lembrete fica separado do último toggle: com 4px o chip quase
   encostava no divider e o grupo parecia uma linha só. */
export const LeadBlock = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`
