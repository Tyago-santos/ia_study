import { type ReactNode, useRef } from 'react'
import type { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { type DropZone, findDayAt } from '../libs/dropZones'

interface DraggableProps {
  zones: SharedValue<DropZone[]>
  hovered: SharedValue<number>
  onDrop: (dayIndex: number) => void
  onMeasure: () => void
  children: ReactNode
}

/**
 * O arrasto so ativa apos um toque longo: sem isso o gesto competiria com o
 * scroll vertical da tela e o planner ficaria impossivel de passar batido.
 */
export function Draggable({ zones, hovered, onDrop, onMeasure, children }: DraggableProps) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const isActive = useSharedValue(0)
  const lastTarget = useSharedValue(-1)

  // `measureInWindow` e o `absoluteX/Y` do gesto nao compartilham origem no
  // Android (a janela inclui a status bar, o gesto nao). Em vez de chutar a
  // constante, ela e derivada no toque: o evento traz a posicao do dedo tanto
  // dentro do item (`x`/`y`) quanto global, e o item sabe onde esta na janela.
  const originX = useSharedValue(0)
  const originY = useSharedValue(0)
  const itemRef = useRef<View>(null)

  const calibrate = (localX: number, localY: number, absX: number, absY: number) => {
    itemRef.current?.measureInWindow((windowX, windowY) => {
      originX.value = windowX + localX - absX
      originY.value = windowY + localY - absY
    })
  }

  const gesture = Gesture.Pan()
    .activateAfterLongPress(180)
    // Remedir no toque, nao no layout: a tela rola, e um retangulo medido na
    // montagem aponta para onde o dia estava antes do scroll. `onBegin` dispara
    // assim que o dedo encosta, entao a medida chega antes do arrasto ativar.
    .onBegin((event) => {
      runOnJS(onMeasure)()
      runOnJS(calibrate)(event.x, event.y, event.absoluteX, event.absoluteY)
    })
    .onStart(() => {
      isActive.value = 1
    })
    .onUpdate((event) => {
      translateX.value = event.translationX
      translateY.value = event.translationY
      lastTarget.value = findDayAt(
        zones.value,
        event.absoluteX + originX.value,
        event.absoluteY + originY.value,
      )
      hovered.value = lastTarget.value
    })
    // O drop e confirmado aqui, e nao no `onEnd`: se o scroll cancelar o gesto
    // no meio do arrasto o `onEnd` nunca dispara, e a solta se perderia.
    // `onFinalize` roda em qualquer desfecho, inclusive cancelamento.
    .onFinalize(() => {
      if (isActive.value === 1 && lastTarget.value >= 0) {
        runOnJS(onDrop)(lastTarget.value)
      }

      lastTarget.value = -1
      translateX.value = withSpring(0)
      translateY.value = withSpring(0)
      isActive.value = 0
      hovered.value = -1
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: isActive.value ? 1.06 : 1 },
    ],
    zIndex: isActive.value ? 50 : 0,
    elevation: isActive.value ? 8 : 0,
  }))

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View ref={itemRef} collapsable={false} style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
