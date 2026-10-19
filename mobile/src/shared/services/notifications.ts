/**
 * Camada unica de avisos do app.
 *
 * Um mesmo evento pode se manifestar de tres formas: banner dentro do app,
 * notificacao na bandeja do sistema e fala. Centralizar aqui evita que cada
 * tela decida sozinha e o comportamento fique inconsistente.
 *
 * Os modulos nativos sao carregados sob demanda e com guarda: eles so existem
 * depois de um rebuild nativo, e um binario antigo (ou o Expo Go) nao pode
 * derrubar o app inteiro por causa de um recurso opcional. Sem isso, o import
 * no topo do arquivo quebra a rota que importa este modulo.
 */
import Constants, { ExecutionEnvironment } from 'expo-constants'
import { Platform } from 'react-native'
import { type NotificationKind, notify } from '@/shared/store/notifications'

/**
 * O Expo Go do SDK 53+ removeu as notificacoes do Android e o proprio import
 * do modulo lanca. O try/catch abaixo segura o erro, mas ele ainda aparece
 * como ERROR no LogBox; conferir o ambiente antes evita o require inteiro.
 */
const isExpoGoAndroid =
  Platform.OS === 'android' &&
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient

type NotificationsModule = typeof import('expo-notifications')
type SpeechModule = typeof import('expo-speech')

let notificationsModule: NotificationsModule | null | undefined
let speechModule: SpeechModule | null | undefined

function getNotifications(): NotificationsModule | null {
  if (notificationsModule !== undefined) return notificationsModule

  if (isExpoGoAndroid) {
    notificationsModule = null
    return notificationsModule
  }

  try {
    notificationsModule = require('expo-notifications') as NotificationsModule

    // Sem isso a notificacao chega silenciosa com o app em primeiro plano.
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })
  } catch {
    notificationsModule = null
  }

  return notificationsModule
}

function getSpeech(): SpeechModule | null {
  if (speechModule !== undefined) return speechModule

  try {
    speechModule = require('expo-speech') as SpeechModule
  } catch {
    speechModule = null
  }

  return speechModule
}

/** O push do sistema so esta disponivel apos o rebuild nativo. */
export function isSystemNotificationAvailable(): boolean {
  return getNotifications() !== null
}

/**
 * Canal Android dos avisos. Precisa ir no `trigger` de cada notificacao: o
 * modulo le o canal de la, nao do `content`. Sem isso tudo cai no canal de
 * fallback e o "Estudos" que aparece nas configuracoes do sistema nao
 * controlaria nada.
 */
const ANDROID_CHANNEL_ID = 'estudos'

/**
 * Verde da marca. O Android pinta com ele o icone pequeno da bandeja — que e a
 * silhueta do logo, gerada em `assets/images/notification-icon.png` e apontada
 * pelo plugin `expo-notifications` no app.json. Os dois precisam combinar, por
 * isso o valor esta escrito aqui em vez de sair do tema (que muda de cor).
 */
const BRAND_COLOR = '#4f46e5'

let permissionGranted: boolean | null = null

/**
 * Descarta a resposta guardada da permissao. O cache vale por sessao, entao
 * sem isso conceder o acesso nas configuracoes do sistema so passaria a valer
 * depois de reiniciar o app.
 */
export function refreshNotificationPermission() {
  permissionGranted = null
}

/**
 * Pede permissao uma vez por sessao. O Android 13+ exige o pedido explicito;
 * antes disso a concessao e implicita.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  const Notifications = getNotifications()
  if (!Notifications) return false

  if (permissionGranted !== null) return permissionGranted

  try {
    const current = await Notifications.getPermissionsAsync()
    permissionGranted = current.granted

    if (!permissionGranted && current.canAskAgain) {
      const requested = await Notifications.requestPermissionsAsync()
      permissionGranted = requested.granted
    }

    if (permissionGranted && Platform.OS === 'android') {
      // O canal define som e prioridade do aviso no Android.
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Estudos',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        lightColor: BRAND_COLOR,
      })
    }
  } catch {
    permissionGranted = false
  }

  return permissionGranted
}

export interface Reminder {
  title: string
  body: string
  /** Momento em que o aviso deve tocar. */
  when: Date
  /** Momento real do compromisso; ausente = igual a `when`. */
  eventAt?: Date
}

/** Folga para o aviso encurtado nao disparar no mesmo instante em que e criado. */
const IMMINENT_DELAY_MS = 5_000

/**
 * Reagenda todos os lembretes do zero e devolve quantos ficaram de pe.
 *
 * Cancelar antes e proposital: eventos mudam de data e blocos somem, e o Expo
 * nao tem como "atualizar" um agendamento — sem a limpeza o usuario receberia
 * avisos de compromissos que ja nao existem.
 */
export async function rescheduleReminders(reminders: Reminder[]): Promise<number> {
  const Notifications = getNotifications()
  if (!Notifications) return 0

  try {
    // Antes do early-return da lista vazia: numa instalacao nova, sem nenhum
    // evento futuro, o app nunca chegaria a pedir a permissao nem a criar o
    // canal — e o primeiro lembrete de verdade ja nasceria sem os dois.
    const granted = await ensureNotificationPermission()

    await Notifications.cancelAllScheduledNotificationsAsync()

    if (!granted || reminders.length === 0) return 0

    const now = Date.now()
    let scheduled = 0

    for (const reminder of reminders) {
      let when = reminder.when.getTime()

      if (when <= now) {
        // A antecedencia caiu no passado, mas o compromisso em si ainda vem:
        // avisar agora vale mais do que engolir o lembrete. So o que ja
        // aconteceu de fato e descartado.
        if ((reminder.eventAt ?? reminder.when).getTime() <= now) continue
        when = now + IMMINENT_DELAY_MS
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          sound: 'default',
          color: BRAND_COLOR,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(when),
          channelId: ANDROID_CHANNEL_ID,
        },
      })

      scheduled++
    }

    return scheduled
  } catch {
    // Um agendamento que falha nao deve derrubar a tela que o disparou.
    return 0
  }
}

interface AlertInput {
  title: string
  message?: string
  kind?: NotificationKind
  /** Aparece na bandeja do sistema, alem do banner interno. */
  system?: boolean
  /** Texto falado em voz alta; ausente = nao fala. */
  speak?: string
}

export async function alertUser({ title, message, kind, system, speak }: AlertInput) {
  // O banner interno nao depende de modulo nativo: sempre acontece.
  notify({ title, message, kind })

  if (speak) {
    try {
      getSpeech()?.speak(speak, { language: 'pt-BR' })
    } catch {
      // Sem voz disponivel o banner ja cumpriu o aviso.
    }
  }

  if (!system) return

  const Notifications = getNotifications()
  if (!Notifications) return

  try {
    if (!(await ensureNotificationPermission())) return

    await Notifications.scheduleNotificationAsync({
      content: { title, body: message, sound: 'default', color: BRAND_COLOR },
      // So o canal, sem horario: entrega imediata, mas no canal certo.
      trigger: { channelId: ANDROID_CHANNEL_ID },
    })
  } catch {
    // idem
  }
}
