import { Platform } from 'react-native'
import { styled } from '@/shared/styles'

export const Container = styled.View<{ $bottomInset: number }>`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
  padding-top: 8px;
  padding-bottom: ${({ theme, $bottomInset }) => Math.max($bottomInset, theme.spacing.xs)}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
  /* Sombra sutil na barra inteira para separar do conteúdo */
  ${Platform.select({
    ios: `
      shadow-color: #000000;
      shadow-offset: 0px -3px;
      shadow-opacity: 0.04;
      shadow-radius: 6px;
    `,
    android: `
      elevation: 8;
    `,
  })}
`

export const Tab = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  min-height: 54px;
`

export const IconWrap = styled.View<{ $active: boolean }>`
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;

  border-radius:42px;
  background-color: ${({ theme, $active }) =>
    $active ? `${theme.colors.accent}18` : 'transparent'};
    
`

export const Label = styled.Text<{ $active: boolean }>`
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  letter-spacing: 0.2px;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};
`

export const FeaturedWrap = styled.View`
  z-index: 10;
  width: 68px;
  height: 68px;
  align-items: center;
  justify-content: center;
  margin-top: -28px;
`

export const FeaturedHalo = styled.View<{ $active?: boolean }>`
  position: absolute;
  width: 68px;
  height: 68px;
  border-radius: 34px;
  /* Brilho sutil ao redor do botão do Tutor quando ativo */
  background-color: ${({ theme, $active }) =>
    $active ? `${theme.colors.accent}22` : `${theme.colors.accent}0d`};
`

export const FeaturedFrame = styled.View`
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.card};
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};
`
export const FeaturedButton = styled.View<{ $active: boolean }>`
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 26px;
  background-color: ${({ theme }) => theme.colors.accent};

  /* Borda grossa na cor do fundo da barra cria o "respiro" suave entre a barra e o botão */
  border-width: 4px;
  border-color: ${({ theme }) => theme.colors.card};

  /* Contorno externo sutil que acompanha a curvatura do botão e continua a borda da tab */
  outline-width: 1px;
  outline-style: solid;
  outline-color: ${({ theme }) => theme.colors.border};

  /* Sombra muito suave apenas para dar leve elevação sem sujar a borda */
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 4px;
  elevation: 3;
`

