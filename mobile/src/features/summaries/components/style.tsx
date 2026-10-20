import { styled } from '@/shared/styles'

/* Card de lista na mesma geometria dos demais paineis do app: raio 20, borda
   baixa no escuro e halo indigo no lugar de sombra preta. */
export const Card = styled.Pressable`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

/* Badge circular com anel e glow na cor da materia: mesmo tratamento dos
   tiles — e' o ponto de cor que identifica o card na varredura da lista. */
export const SourceIcon = styled.View<{ $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
  border-width: 1px;
  border-color: ${({ $color }) => `${$color}33`};

  shadow-color: ${({ $color }) => $color};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  elevation: 3;
`

export const CardHeaderInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

/* Titulo de secao:16/700 com tracking negativo, igual aos demais cards. */
export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.colors.text};
`

export const CardContent = styled.Text`
  font-size: 13px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const CardFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

/* Meta vira label (11/700 + tracking): no corpo 11 regular as letras grudavam
   e a data parecia ruído em vez de informação. */
export const CardMeta = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* "Ler tudo" e' uma acao modular, entao ganha a geometria de pill do app —
   o texto solto no canto nao dizia que era tocavel. */
export const CardToggle = styled.Text`
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm + 2}px;
  padding-vertical: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.accentText};
  background-color: ${({ theme }) => `${theme.colors.accent}1f`};
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.accent}55`};
`
