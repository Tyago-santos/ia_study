const { withAndroidStyles } = require('@expo/config-plugins')

/**
 * Tira o sublinhado azul que o Android desenha sob todo campo de texto.
 *
 * O tema define `android:editTextBackground` como um selector que, no estado
 * "ativado" (campo em foco), pinta uma linha na cor de destaque — o azul. Ela
 * e' o *background* do EditText, e nao a borda: fica por baixo da borda
 * arredondada que os estilos do app desenham, aparecendo como um risco azul
 * colado na base do campo. `@null` apaga esse drawable.
 *
 * Sao dois temas porque o app tem duas janelas:
 *
 * - `AppTheme` vale para as telas normais.
 * - `Theme.FullScreenDialog` vale para o que esta dentro de um `<Modal>`: o RN
 *   nao renderiza o modal na mesma janela, ele abre um `ComponentDialog` com
 *   um tema proprio (ver `ReactModalHostView.kt`). Esse tema e' declarado sem
 *   `parent`, entao nao herda nada do `AppTheme` — um campo dentro de modal
 *   continuava com o sublinhado mesmo depois de corrigir a tela inteira. E'
 *   por isso que o formulario de cadastro (tela comum) nunca teve o risco azul
 *   e o de criar flashcard (modal) tinha.
 *
 * Redefinir `Theme.FullScreenDialog` aqui sobrepoe a versao que vem do RN:
 * recurso do app tem precedencia sobre o da biblioteca na hora do merge. Os
 * itens sao os mesmos do original — so entra o `editTextBackground`, para nao
 * mexer em como o modal se comporta.
 *
 * Precisa ser plugin porque `android/` e' gerado pelo prebuild: editar o
 * styles.xml direto some na proxima geracao.
 */

const NO_UNDERLINE = { _: '@null', $: { name: 'android:editTextBackground' } }

/** Igual ao `Theme.FullScreenDialog` do RN, mais o item que apaga o sublinhado. */
const MODAL_THEME = {
  $: { name: 'Theme.FullScreenDialog' },
  item: [
    { _: 'true', $: { name: 'android:windowNoTitle' } },
    { _: 'false', $: { name: 'android:windowIsFloating' } },
    { _: '@android:color/transparent', $: { name: 'android:windowBackground' } },
    { _: 'true', $: { name: 'android:windowDrawsSystemBarBackgrounds' } },
    { _: '@android:color/transparent', $: { name: 'android:statusBarColor' } },
    NO_UNDERLINE,
  ],
}

function setItem(style, item) {
  style.item ??= []

  const existing = style.item.find((entry) => entry.$?.name === item.$.name)
  if (existing) existing._ = item._
  else style.item.push(item)
}

module.exports = function withNoEditTextUnderline(config) {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults.resources.style ?? []

    const appTheme = styles.find((style) => style.$?.name === 'AppTheme')
    if (appTheme) setItem(appTheme, NO_UNDERLINE)

    // O prebuild reaproveita o styles.xml anterior: sem procurar antes, cada
    // rodada acrescentaria o mesmo tema de novo.
    const modalTheme = styles.find((style) => style.$?.name === 'Theme.FullScreenDialog')
    if (modalTheme) setItem(modalTheme, NO_UNDERLINE)
    else styles.push(MODAL_THEME)

    config.modResults.resources.style = styles
    return config
  })
}
