const { withAndroidManifest } = require('@expo/config-plugins')

/**
 * Permite que os lembretes toquem na hora exata no Android 12+.
 *
 * A partir do Android 12 um alarme so e exato se o app pedir a permissao; sem
 * ela o `expo-notifications` cai em `setAndAllowWhileIdle`, que o sistema
 * agrupa e adia — o lembrete das 14:00 chegaria alguns minutos depois, o que
 * derruba o proposito de um aviso de cronograma.
 *
 * Sao duas permissoes porque a regra mudou no meio do caminho:
 * - SCHEDULE_EXACT_ALARM vale ate o Android 12L (API 32), onde ja vem
 *   concedida; por isso o `maxSdkVersion`.
 * - USE_EXACT_ALARM vale do Android 13 em diante e nao pergunta nada ao
 *   usuario, mas na Play Store so pode ser declarada por app cuja funcao seja
 *   alarme, agenda ou lembrete — que e o caso do cronograma. Publicando na
 *   loja, essa e a declaracao que precisa ser justificada no formulario.
 */
const EXACT_ALARM_PERMISSIONS = [
  { name: 'android.permission.SCHEDULE_EXACT_ALARM', maxSdkVersion: '32' },
  { name: 'android.permission.USE_EXACT_ALARM' },
]

module.exports = function withExactAlarms(config) {
  return withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults
    manifest['uses-permission'] ??= []

    for (const permission of EXACT_ALARM_PERMISSIONS) {
      const attributes = { 'android:name': permission.name }
      if (permission.maxSdkVersion) {
        attributes['android:maxSdkVersion'] = permission.maxSdkVersion
      }

      // O prebuild reaproveita o manifesto anterior: sem procurar antes, cada
      // rodada acrescentaria a mesma permissao de novo.
      const existing = manifest['uses-permission'].find(
        (entry) => entry.$?.['android:name'] === permission.name,
      )

      if (existing) existing.$ = { ...existing.$, ...attributes }
      else manifest['uses-permission'].push({ $: attributes })
    }

    return config
  })
}
