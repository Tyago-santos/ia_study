import { View } from 'react-native'
import { mixHex } from '@/shared/lib/color'

interface GradientProps {
  /** Cor inicial (inicio da faixa). */
  from: string
  /** Cor final (fim da faixa). */
  to: string
  axis?: 'horizontal' | 'vertical'
  /**
   * Numero de faixas. 20 ja' e' indistinguivel de um gradiente continuo na
   * tela do celular (o passo de cor por faixa fica abaixo do limiar de
   * percepcao) sem custar render.
   */
  bands?: number
}

/**
 * Gradiente decorativo em JS puro, desenhado por cima do fundo do pai.
 *
 * Nao ha' gradiente nativo no React Native sem lib extra, e lib extra exigiria
 * rebuild (ver `shared/lib/color.ts`). A alternativa e' empilhar faixas de cor
 * interpolada: o olho nao resolve as emendas, e tudo aqui e' so' visual — nao
 * recebe toque (`pointerEvents="none"`) e nao desloca layout.
 *
 * O pai precisa de `position: relative` + `overflow: hidden` para que as
 * faixas se recortem no raio de canto.
 */
export function Gradient({ from, to, axis = 'horizontal', bands = 20 }: GradientProps) {
  const count = Math.max(2, bands)

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: axis === 'vertical' ? 'column' : 'row',
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            backgroundColor: mixHex(from, to, i / (count - 1)),
          }}
        />
      ))}
    </View>
  )
}
