/**
 * Digitacao livre de "HH:MM" com os digitos ja limitados a horas e minutos
 * validos, para nao aceitar "99:88" e quebrar os calculos que dependem disso.
 */
export function maskTime(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length === 0) return ''

  const hours = digits.slice(0, 2)
  const minutes = digits.slice(2)

  const safeHours = hours.length === 2 ? String(Math.min(23, Number(hours))).padStart(2, '0') : hours
  if (minutes.length === 0) return safeHours

  const safeMinutes =
    minutes.length === 2 ? String(Math.min(59, Number(minutes))).padStart(2, '0') : minutes

  return `${safeHours}:${safeMinutes}`
}

/** "14:00" + 50min -> "14:50". Retorna null se o horario nao for valido. */
export function addMinutes(startTime: string, minutes: number): string | null {
  const [hours, mins] = startTime.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(mins)) return null

  const total = hours * 60 + mins + minutes
  const endHours = Math.floor(total / 60) % 24
  const endMinutes = total % 60

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

/** Um "HH:MM" so vale para agendar quando esta completo. */
export function isCompleteTime(value: string): boolean {
  return /^\d{2}:\d{2}$/.test(value)
}

/**
 * "AAAA-MM-DD" de hoje no fuso local. new Date().toISOString() usa UTC: das
 * 21h as 23h59 no Brasil isso ja e o dia seguinte, abrindo o cronograma com
 * a data errada pre-selecionada.
 */
export function todayISODate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
