import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, Switch } from 'react-native'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { useTheme } from '@/shared/hooks/useTheme'
import { usePomodoro } from '../hooks/usePomodoro'
import { DURATION_OPTIONS, MODE_LABELS, formatPomodoroTime, type PomodoroMode } from '../libs/timer'
import { MODE_COLORS } from '../services/pomodoro.service'
import * as S from './style'

/**
 * Pomodoro compacto no topo do dashboard. Recolhido mostra so o relogio e os
 * controles; expandido revela modo, materia e duracoes.
 */
export function PomodoroWidget() {
  const { colors } = useTheme()
  const [expanded, setExpanded] = useState(false)

  const {
    settings,
    mode,
    timeLeft,
    isRunning,
    completedFocus,
    selectedSubjectId,
    setSettings,
    setSelectedSubjectId,
    switchMode,
    toggleRunning,
    resetTimer,
    subjects,
    subjectName,
    progress,
    blocked,
  } = usePomodoro()

  const accent = MODE_COLORS[mode]

  return (
    <S.Card $accent={accent}>
      <S.MainRow>
        <S.IconBadge $accent={accent}>
          <Ionicons name="timer" size={17} color={accent} />
        </S.IconBadge>

        <S.Info>
          <S.Time>{formatPomodoroTime(timeLeft)}</S.Time>
          <S.Meta numberOfLines={1}>
            {MODE_LABELS[mode]}
            {subjectName ? ` · ${subjectName}` : ''}
            {completedFocus > 0 ? ` · ${completedFocus} ciclos` : ''}
          </S.Meta>
        </S.Info>

        <Pressable onPress={resetTimer} hitSlop={8}>
          <Ionicons name="refresh" size={19} color={colors.textSecondary} />
        </Pressable>

        <S.PlayButton onPress={toggleRunning} disabled={blocked} $accent={accent} $blocked={blocked}>
          <Ionicons name={isRunning ? 'pause' : 'play'} size={18} color="#ffffff" />
        </S.PlayButton>

        <Pressable onPress={() => setExpanded(!expanded)} hitSlop={8}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={19}
            color={colors.textSecondary}
          />
        </Pressable>
      </S.MainRow>

      <ProgressBar value={progress} color={accent} height={5} />

      {blocked ? <S.Warning>Escolha uma matéria para iniciar o foco</S.Warning> : null}

      {expanded ? (
        <S.Panel>
          <S.PanelLabel>Modo</S.PanelLabel>
          <S.ModeRow>
            {(Object.keys(MODE_LABELS) as PomodoroMode[]).map((option) => {
              const isActive = mode === option

              return (
                <S.ModeOption
                  key={option}
                  onPress={() => switchMode(option)}
                  $color={MODE_COLORS[option]}
                  $active={isActive}
                >
                  <S.ModeLabel $color={MODE_COLORS[option]} $active={isActive}>
                    {MODE_LABELS[option]}
                  </S.ModeLabel>
                </S.ModeOption>
              )
            })}
          </S.ModeRow>

          <S.PanelLabel>Matéria</S.PanelLabel>
          <FilterChips
            value={selectedSubjectId}
            onChange={setSelectedSubjectId}
            options={subjects.map((s) => ({ value: s.id, label: s.name, color: s.color }))}
          />

          <S.PanelLabel>Duração do foco</S.PanelLabel>
          <FilterChips
            value={String(settings.focusMinutes)}
            onChange={(value) => setSettings({ focusMinutes: Number(value) })}
            options={DURATION_OPTIONS.map((minutes) => ({
              value: String(minutes),
              label: `${minutes}min`,
            }))}
          />

          <S.PanelLabel>Aviso ao terminar</S.PanelLabel>
          <S.PhraseInput
            value={settings.endPhrase}
            onChangeText={(endPhrase) => setSettings({ endPhrase })}
            placeholder="Tempo acabou"
            placeholderTextColor={colors.textSecondary}
          />

          <S.ToggleRow>
            <S.ToggleLabel>Falar em voz alta</S.ToggleLabel>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(soundEnabled) => setSettings({ soundEnabled })}
              trackColor={{ true: accent, false: colors.border }}
            />
          </S.ToggleRow>

          <S.ToggleRow>
            <S.ToggleLabel>Notificar no celular</S.ToggleLabel>
            <Switch
              value={settings.systemNotification}
              onValueChange={(systemNotification) => setSettings({ systemNotification })}
              trackColor={{ true: accent, false: colors.border }}
            />
          </S.ToggleRow>

          {isRunning ? (
            <S.Warning>A duração alterada vale a partir do próximo ciclo.</S.Warning>
          ) : null}
        </S.Panel>
      ) : null}
    </S.Card>
  )
}
