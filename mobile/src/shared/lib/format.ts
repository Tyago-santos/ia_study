export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string): string {
  const d = new Date(date)
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

/** "há 2 dias", "agora" — usado nas timelines de atividade e no chat. */
export function formatRelative(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const minutes = Math.round(diffMs / 60000)

  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes}min`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `há ${hours}h`

  const days = Math.round(hours / 24)
  if (days < 30) return `há ${days}d`

  return formatDate(date)
}
