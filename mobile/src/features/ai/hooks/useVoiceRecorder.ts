import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio'
import { File } from 'expo-file-system'

/** `.m4a` (AAC) e' o formato do preset HIGH_QUALITY nas duas plataformas. */
const AUDIO_MIME_TYPE = 'audio/mp4'

export interface RecordedAudio {
  mimeType: string
  base64: string
}

/**
 * Grava uma mensagem de voz e devolve o audio em base64, pronto pra mandar
 * pro Gemini (ver `transcribeAudio` em gemini.client.ts). Nao guarda nada em
 * disco a longo prazo — o arquivo vive so' no cache do sistema.
 */
export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const state = useAudioRecorderState(recorder)

  /** Devolve `false` quando a permissao de microfone foi negada. */
  const start = async (): Promise<boolean> => {
    const { granted } = await requestRecordingPermissionsAsync()
    if (!granted) return false

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })
    await recorder.prepareToRecordAsync()
    recorder.record()
    return true
  }

  /** Para a gravacao e le o arquivo. `null` se nada foi gravado. */
  const stop = async (): Promise<RecordedAudio | null> => {
    await recorder.stop()
    if (!recorder.uri) return null

    const base64 = await new File(recorder.uri).base64()
    return { mimeType: AUDIO_MIME_TYPE, base64 }
  }

  /** Descarta uma gravacao em andamento sem transcrever (ex.: usuario fechou o menu). */
  const cancel = async () => {
    if (!state.isRecording) return
    await recorder.stop().catch(() => {})
  }

  return { isRecording: state.isRecording, start, stop, cancel }
}
