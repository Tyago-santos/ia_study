import { Ionicons } from '@expo/vector-icons'
import type { SharedValue } from 'react-native-reanimated'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import type { ScheduleEvent, Subject } from '@/shared/types'
import { EVENT_COLORS, EVENT_ICONS } from '../libs/eventStyles'
import type { DropZone } from '../libs/dropZones'
import { Draggable } from './Draggable'
import * as S from './style'

interface PlannerPaletteProps {
  subjects: Subject[]
  /** Compromissos fora desta semana, que ainda precisam de um dia. */
  pendingEvents: ScheduleEvent[]
  zones: SharedValue<DropZone[]>
  hovered: SharedValue<number>
  onMeasure: () => void
  onDropSubject: (subject: Subject, dayIndex: number) => void
  onDropEvent: (event: ScheduleEvent, weekday: number) => void
}

/** Origem do arrasto: materias e compromissos ainda sem dia na semana. */
export function PlannerPalette({
  subjects,
  pendingEvents,
  zones,
  hovered,
  onMeasure,
  onDropSubject,
  onDropEvent,
}: PlannerPaletteProps) {
  return (
    <>
      <S.Palette>
        {subjects.length === 0 ? (
          <S.PaletteEmpty>Crie matérias na Biblioteca para vê-las aqui.</S.PaletteEmpty>
        ) : (
          subjects.map((subject) => (
            <Draggable
              key={subject.id}
              zones={zones}
              hovered={hovered}
              onMeasure={onMeasure}
              onDrop={(dayIndex) => onDropSubject(subject, dayIndex)}
            >
              <S.SubjectChip $color={subject.color}>
                <S.SubjectChipIcon $color={subject.color}>
                  <Ionicons name={getSubjectIcon(subject.icon)} size={13} color={subject.color} />
                </S.SubjectChipIcon>
                <S.SubjectChipLabel $color={subject.color} numberOfLines={1}>
                  {subject.name}
                </S.SubjectChipLabel>
              </S.SubjectChip>
            </Draggable>
          ))
        )}
      </S.Palette>

      {pendingEvents.length > 0 ? (
        <>
          <S.PaletteLabel>Compromissos a posicionar</S.PaletteLabel>
          <S.Palette>
            {pendingEvents.map((event) => (
              <Draggable
                key={event.id}
                zones={zones}
                hovered={hovered}
                onMeasure={onMeasure}
                onDrop={(weekday) => onDropEvent(event, weekday)}
              >
                <S.EventChip $color={EVENT_COLORS[event.type]}>
                  <Ionicons
                    name={EVENT_ICONS[event.type]}
                    size={13}
                    color={EVENT_COLORS[event.type]}
                  />
                  <S.EventChipLabel $color={EVENT_COLORS[event.type]} numberOfLines={1}>
                    {event.title}
                  </S.EventChipLabel>
                </S.EventChip>
              </Draggable>
            ))}
          </S.Palette>
        </>
      ) : null}
    </>
  )
}
