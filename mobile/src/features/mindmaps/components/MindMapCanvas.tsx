import { useMemo } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import type { MindMapNode } from '@/shared/types'
import {
  CANVAS_PADDING,
  buildEdges,
  layoutMindMap,
  resolveBranchColors,
} from '../libs/layout'
import { INITIAL_SCALE, clampScale } from '../services/mindmaps.service'
import * as S from './style'

interface MindMapCanvasProps {
  nodes: MindMapNode[]
  accent: string
  selectedId: string | null
  onSelect: (nodeId: string) => void
}

export function MindMapCanvas({ nodes, accent, selectedId, onSelect }: MindMapCanvasProps) {
  const layout = useMemo(() => layoutMindMap(nodes), [nodes])
  const edges = useMemo(() => buildEdges(layout, nodes), [layout, nodes])
  // Cor efetiva por no: ramos da raiz ganham cores da paleta e os filhos herdam.
  const colorsById = useMemo(() => resolveBranchColors(nodes), [nodes])

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(INITIAL_SCALE)
  // Guardam o valor do inicio de cada gesto para o movimento ser incremental.
  const startX = useSharedValue(0)
  const startY = useSharedValue(0)
  const startScale = useSharedValue(INITIAL_SCALE)

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value
      startY.value = translateY.value
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX
      translateY.value = startY.value + event.translationY
    })

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value
    })
    .onUpdate((event) => {
      scale.value = clampScale(startScale.value * event.scale)
    })

  // Duplo toque volta ao enquadramento inicial: com o mapa arrastado para longe
  // seria facil "perder" a arvore fora da area visivel.
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      translateX.value = withTiming(0)
      translateY.value = withTiming(0)
      scale.value = withTiming(INITIAL_SCALE)
    })

  const gesture = Gesture.Simultaneous(pan, pinch, doubleTap)

  const canvasStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <GestureDetector gesture={gesture}>
      <S.Viewport>
        <S.Canvas style={[{ width: layout.width, height: layout.height }, canvasStyle]}>
          {edges.map((edge) => (
            <S.Edge
              key={edge.id}
              $accent={colorsById.get(edge.id) ?? accent}
              style={{
                width: edge.length,
                left: CANVAS_PADDING + edge.centerX - edge.length / 2,
                top: CANVAS_PADDING + edge.centerY,
                transform: [{ rotate: `${edge.angle}deg` }],
              }}
            />
          ))}

          {layout.nodes.map(({ node, depth, x, y }) => {
            const isRoot = depth === 0
            const nodeColor = isRoot ? null : (colorsById.get(node.id) ?? null)

            return (
              <S.Node
                key={node.id}
                onPress={() => onSelect(node.id)}
                $accent={accent}
                $color={nodeColor}
                $root={isRoot}
                $selected={selectedId === node.id}
                style={{ left: CANVAS_PADDING + x, top: CANVAS_PADDING + y }}
              >
                {!isRoot ? <S.NodeBar $color={nodeColor ?? accent} /> : null}

                <S.NodeLabel $root={isRoot} numberOfLines={2}>
                  {node.label}
                </S.NodeLabel>

                {node.note ? <S.NoteDot $accent={nodeColor ?? accent} /> : null}
              </S.Node>
            )
          })}
        </S.Canvas>
      </S.Viewport>
    </GestureDetector>
  )
}
