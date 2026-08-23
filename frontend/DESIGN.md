---
name: Gnosis IA
description: Terminal de estudos — verde neon sobre preto, vidro em camadas, densidade de painel.
colors:
  phosphor-green: "#00ff00"
  phosphor-green-deep: "#00cc00"
  phosphor-green-dark: "#009900"
  accent-text-on-paper: "#006600"
  accent-text-on-void: "#00ff00"
  on-accent: "#0f172a"
  focus-ring-on-paper: "#009900"
  danger-on-paper: "#dc2626"
  danger-on-void: "#ef4444"
  warning-on-paper: "#b45309"
  negative-on-paper: "#e11d48"
  mint-pale: "#a5ffb7"
  void-black: "#000000"
  void-raised: "#0a0a0a"
  slate-ink: "#0f172a"
  slate-muted: "#475569"
  paper-cool: "#f8fafc"
  paper-raised: "#f1f5f9"
  amber-paper: "#fefce8"
  amber-ink: "#422006"
  amber-rule: "#fde047"
  signal-error: "#ef4444"
  signal-warning: "#f59e0b"
  signal-success: "#22c55e"
typography:
  display:
    fontFamily: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.05em"
  mono:
    fontFamily: "'Space Mono', 'Courier New', monospace"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  full: "9999px"
spacing:
  xs: "0.375rem"
  sm: "0.625rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.phosphor-green}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.lg}"
    padding: "0 1rem"
    height: "2.5rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.phosphor-green-deep}"
    textColor: "{colors.slate-ink}"
  button-secondary:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.lg}"
    height: "2.5rem"
  button-ghost:
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.lg}"
    height: "2.5rem"
  card:
    backgroundColor: "{colors.paper-cool}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.paper-cool}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.lg}"
    height: "2.5rem"
    padding: "0 0.75rem"
  chip-stat:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.xl}"
    padding: "0.375rem 0.75rem"
    typography: "{typography.micro}"
---

# Design System: Gnosis IA

## Overview

**Creative North Star: "O Terminal de Estudos"**

Este sistema veste a herança do terminal de fósforo verde e a trata como identidade
deliberada, não como piada retrô. O verde de saturação máxima sobre preto absoluto é a
assinatura; o `Space Mono` aparece onde há medição; e os utilitários `text-glow`,
`box-glow` e `animate-glitch` no CSS global existem porque o brilho de CRT é parte da voz,
não um acidente.

O humor é energético e competitivo. O produto mede o esforço do aluno e devolve progresso
visível — XP, ofensiva, calendário de contribuições, anéis de acerto — e o verde é a cor
dessa recompensa. Cada superfície carrega densidade de painel: muita informação legível em
pouco espaço, com o texto de corpo em 14px e uma camada inteira de micro-rótulos em 10-11px
para as métricas secundárias.

A profundidade vem de vidro em camadas, não de sombra material. Superfícies são
translúcidas (`backdrop-blur` de 4px a 24px) sobre um fundo que muda por tema, e a elevação
é a resposta à interação: o card sobe 2px e a sombra cresce quando o ponteiro chega. No tema
escuro a sombra não é preta — é um halo verde, o que reforça a leitura de brilho emitido em
vez de objeto iluminado.

**Key Characteristics:**
- Verde neon como cor única de sinal; o sistema é monocromático por construção
- Preto absoluto (`#000000`) como fundo do tema escuro, não cinza-escuro
- Vidro translúcido com borda de 1px em verde de baixa opacidade
- Elevação como resposta ao toque, nunca como estado de repouso
- Três temas de igual cidadania: `light`, `dark`, `reading`
- Densidade alta: 12px e 14px dominam; 10-11px carregam as métricas

## Colors

Paleta monocromática de um só acento: verde neon fazendo todo o trabalho de sinal, sobre
neutros que trocam completamente entre os três temas.

### Primary
- **Verde Neon** (`#00ff00`): o acento único. Marca ação disponível, estado ativo, progresso
  e valor conquistado. Aparece em ícone, borda, preenchimento de gráfico e anel de foco. É a
  cor mais saturada do sistema e a única que não pertence a nenhum neutro.
- **Verde Neon Profundo** (`#00cc00`): o mesmo sinal um passo abaixo, para estado `hover`,
  gradientes e o acento do tema claro, onde o neon puro seria estridente sobre papel.
- **Verde Neon Escuro** (`#009900`): estado `active` e a ponta escura das séries de gráfico.

### Neutral
- **Preto Absoluto** (`#000000`): fundo do tema escuro. Zero, não cinza — é o que faz o
  fósforo brilhar.
- **Preto Elevado** (`#0a0a0a`): a primeira camada acima do fundo escuro.
- **Menta Pálida** (`#a5ffb7`): texto secundário no tema escuro. O sistema tinge de verde até
  a hierarquia secundária, em vez de recorrer a cinza.
- **Tinta Slate** (`#0f172a`) e **Slate Suave** (`#475569`): texto primário e secundário do
  tema claro.
- **Papel Frio** (`#f8fafc`) e **Papel Elevado** (`#f1f5f9`): fundos do tema claro.
- **Papel Âmbar** (`#fefce8`), **Tinta Âmbar** (`#422006`), **Régua Âmbar** (`#fde047`): a
  tríade completa do tema `reading`, pensada para leitura prolongada.

### Named Rules

**The Single Signal Rule.** O verde é o acento dominante: 27 dos 32 pares de gradiente em uso
são verde→verde. Os nomes `violet`, `emerald` e `cyan` do tema Tailwind foram deliberadamente
redefinidos para verdes (`--color-cyan-500: #00cc00`), portanto um gradiente
`from-primary-500 to-cyan-500` renderiza verde→verde — pedir "verde para ciano" não produz
duas cores.

A exceção é a fileira de cards de métrica do dashboard, e ela é deliberada: `teal-500` e
`orange-500` **não** foram redefinidos, então a ofensiva é laranja-fogo real
(`from-amber-500 to-orange-500`) e a semana é teal. Ali a cor codifica qual métrica se está
lendo, o que é uso semântico e não decoração.

Fora dessa fileira, não introduza uma cor de acento nova sem decisão explícita: em todo o
resto do produto verde significa sinal, e uma segunda cor quebra essa leitura.

**The Dark-On-Phosphor Rule.** Onde o verde neon é fundo, o primeiro plano é `--on-accent`
(`#0f172a`), nunca branco. Medido: branco sobre `#00ff00` dá **1,37:1** e sobre `#00cc00` dá
**2,18:1** — ambos falham o mínimo de 4,5:1 do WCAG AA, e nenhum degrau de verde salva o
branco antes de `#006600`, que destruiria a assinatura neon. Tinta slate sobre `#00ff00` dá
**13,01:1**. O verde é luminoso; tratá-lo como cor escura é o erro que este sistema não
comete. Vale também para os ladrilhos âmbar, laranja e teal: `#0f172a` passa em todos.

**The Foreground-Follows-Theme Rule.** Cor de preenchimento e cor de texto são tokens
distintos. Nenhum valor único atinge 4,5:1 nos três temas — verificado para verde, vermelho,
âmbar e rose — por isso o primeiro plano vem sempre de um token que muda com o tema:

| Token | claro / reading | escuro |
|---|---|---|
| `--accent-text` | `#006600` (7,18:1) | `#00ff00` (14,03:1) |
| `--focus-ring` | `#009900` (3,75:1, mínimo não-textual) | `#00ff00` |
| `--danger` | `#dc2626` (4,79:1) | `#ef4444` (5,12:1) |
| `--warning` | `#b45309` (4,98:1) | `#f59e0b` (8,97:1) |
| `--negative` | `#e11d48` (4,66:1) | `#f43f5e` (5,24:1) |

Nunca aplique `text-primary-500` como cor de texto: ele dá 1,36:1 sobre papel. Use
`text-[var(--accent-text)]`.

**The Semantic Escape Rule.** Vermelho (`#ef4444`), âmbar (`#f59e0b`) e verde-sucesso
(`#22c55e`) existem só para erro, alerta e confirmação. Eles não são acentos decorativos e
não competem com o sinal principal.

## Typography

**Body Font:** Roboto (com `system-ui`, `-apple-system`, `Segoe UI`, sans-serif)
**Label/Mono Font:** Space Mono (com `Courier New`, monospace)

**Character:** Roboto é o corpo neutro e trabalhador que aguenta densidade sem chamar
atenção; Space Mono é a voz do instrumento, reservada a valor medido. O par funciona porque
os dois são de largura franca e não competem: um carrega texto, o outro carrega número.

### Hierarchy
- **Display** (700, 1.5rem/24px): título de página no cabeçalho de cada superfície. É o maior
  tipo do sistema — não existe hero tipográfico.
- **Title** (600, 1rem/16px): título de card e de seção.
- **Body** (400-500, 0.875rem/14px): o tamanho de trabalho do sistema. Rótulo de formulário,
  item de lista, texto de conteúdo.
- **Label** (500, 0.75rem/12px): o tamanho mais frequente do código. Metadado, rótulo de
  ação, texto de apoio.
- **Micro** (600, 0.625-0.6875rem/10-11px, `tracking-wider`, frequentemente maiúsculas): a
  camada de instrumentação — contadores, unidades, cabeçalho de grupo na navegação.

### Named Rules

**The Measured-Value Rule.** Space Mono é para valor medido, não para prosa. Timer, contador
e código usam mono; frase nunca.

**The Two-Step Rule** *(alvo, não estado atual).* Ênfase se constrói por peso e cor, não por
salto de escala — é o que permite a densidade sem ruído. O código ainda não cumpre isso: há
**11 tamanhos em uso** (10, 11, 12, 13, 14, 16, 18, 20, 24 e 30px, mais valores arbitrários),
com saltos irregulares. Os cinco papéis descritos acima são a escala pretendida; ao editar
tipografia, convirja para eles em vez de acrescentar um degrau novo.

## Layout

Casca de aplicação com barra lateral fixa e conteúdo rolável. A lateral tem 256px expandida
e 72px recolhida (a transição é de 300ms), colapsa para gaveta sobreposta abaixo de `lg`
(1024px) e ganha um backdrop escurecido com blur quando aberta em telas pequenas.

Grade de conteúdo padrão: 1 coluna no telefone, 2 em `md` (768px), 3 em `lg`. O ritmo
vertical entre blocos de uma página é `space-y-6` (24px); dentro de um card, `space-y-4`
(16px). Preenchimento interno de card é 24px (`p-6`), com 20px (`p-5`) nas variantes mais
densas.

Densidade é uma escolha, não um acidente: as barras de estatística usam chips de 6px×12px de
preenchimento e texto de 10-11px para caber quatro métricas numa linha de telefone. Os
breakpoints em uso são `sm` 640px, `md` 768px e `lg` 1024px — o sistema não usa `xl` nem
`2xl`.

## Elevation & Depth

Sistema híbrido de **vidro em camadas com elevação por interação**. A profundidade em
repouso vem de translucidez e tom, não de sombra: cada superfície é um vidro
(`--card-bg`, `--glass-bg`) com `backdrop-blur` sobre o fundo, delimitado por uma borda de
1px em verde de baixa opacidade (`--glass-border`). A sombra em repouso é larga e quase
imperceptível.

A elevação é reservada para o momento da interação. O card sobe 2px e troca para
`shadow-lg`; o botão de destaque da navegação escala 1,02 e intensifica o halo.

**Crucialmente, a sombra troca de natureza entre os temas:** no claro é sombra
(`rgba(0,0,0,0.06)`), no escuro é **brilho verde** (`rgba(0,255,0,0.08)`). No tema escuro as
superfícies não são iluminadas de fora — elas emitem.

### Shadow Vocabulary
- **Vidro em repouso** (`0 8px 32px rgba(0,0,0,0.06)`; escuro: `0 8px 32px rgba(0,255,0,0.08)`):
  o assentamento padrão de card e barra lateral.
- **Elevação de interação** (`shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1)`): resposta a
  `hover` em superfície clicável, acompanhada de `-translate-y-0.5`.
- **Halo de acento** (`0 10px 15px -3px rgba(0,255,0,0.3)`): sob elemento preenchido de verde,
  como o botão de Chat IA. É brilho, não sombra.
- **Sobreposição** (`shadow-2xl`): exclusivo de modal, sobre backdrop com blur.

### Named Rules

**The Emitted-Light Rule.** No tema escuro, sombra é brilho verde. Nunca aplique sombra preta
sobre o fundo `#000000` — ela é invisível e desperdiça a leitura de superfície emissora.

**The Lift-On-Touch Rule.** Superfícies são assentadas em repouso. Elevação é resposta a
`hover`, `focus` ou arraste — nunca um estado permanente que hierarquize por altura.

## Shapes

Linguagem de cantos generosos e consistentes, em quatro passos de uso claro:
**12px** (`rounded-xl`) é o padrão do sistema — botão de ícone, chip, campo, item de
navegação. **8px** (`rounded-lg`) é o passo interno, para botões e elementos dentro de um
card. **16px** (`rounded-2xl`) pertence a contêineres de página: card, modal, cabeçalho de
superfície. **Pílula completa** (`rounded-full`) é exclusiva de avatar, ponto indicador,
badge de contagem e barra de progresso.

Bordas são sempre de 1px e quase sempre tingidas de verde translúcido, o que produz a
"borda fantasma" que delimita vidro sem desenhar uma linha dura. A exceção é o nó de mapa
mental, que usa borda de 2px na cor do próprio ramo — ali a borda é a informação.

### Named Rules

**The Ghost Border Rule.** Toda superfície de vidro é delimitada por 1px de verde de baixa
opacidade, não por uma linha cinza. A borda pertence à cor do sistema, não ao neutro.

## Components

### Buttons
- **Shape:** cantos suaves de 8px (`rounded-lg`); alturas fixas de 32px (`sm`), 40px (`md`) e
  48px (`lg`).
- **Primary:** preenchimento verde neon com texto quase-preto (ver *The Dark-On-Phosphor
  Rule*), 16px de preenchimento horizontal em `md`.
- **Hover / Focus:** troca para verde profundo (`#00cc00`) e para verde escuro (`#009900`) em
  `active`; foco produz anel de 2px em verde com 2px de deslocamento. Transição de 200ms.
- **Secondary:** fundo do tom elevado do tema com texto primário — o botão que não pede
  atenção.
- **Ghost:** sem fundo em repouso, texto secundário; ganha o tom elevado no `hover`.
- **Danger:** preenchimento vermelho (`#ef4444`) com texto branco, reservado a ação
  destrutiva.
- Desabilitado é 50% de opacidade com cursor bloqueado, em todas as variantes.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** vidro do tema (`--card-bg`) com `backdrop-blur` de 4px.
- **Shadow Strategy:** vidro em repouso; sobe a elevação de interação no `hover` junto de
  `-translate-y-0.5` (ver *The Lift-On-Touch Rule*).
- **Border:** 1px de verde translúcido (*The Ghost Border Rule*).
- **Internal Padding:** 24px padrão; 20px na variante densa.

### Inputs / Fields
- **Style:** altura de 40px, cantos de 8px, borda de 1px no neutro do tema, fundo de vidro,
  12px de preenchimento horizontal.
- **Focus:** anel de 2px em verde neon e a borda própria fica transparente — o anel substitui
  a borda em vez de somar a ela.
- **Error:** borda em vermelho (`#ef4444`) com mensagem de 14px abaixo do campo.
- Rótulo acima do campo, 14px peso 500, com 4px de respiro.

### Navigation
- Barra lateral de vidro com blur de 24px e borda direita fantasma. Itens são pílulas de 12px
  com ícone de 18px e rótulo de 14px peso 500.
- **Ativo:** gradiente verde de baixa opacidade, texto e ícone em verde, e um ponto de 6px na
  extremidade direita como marcador.
- **Hover:** fundo de vidro e texto sobe para o primário.
- O item de Chat IA é a exceção deliberada: preenchimento verde sólido, halo de acento,
  escala 1,02 no `hover` e um selo "IA". É o único item que grita, e isso é intencional.
- Recolhida, a lateral mantém só os ícones centralizados e move o rótulo para `title`.

### Cabeçalho de Superfície (componente de assinatura)
Cada página abre com o mesmo bloco: contêiner de 16px de canto com um lavado de gradiente
verde diagonal por cima, um ladrilho de ícone de 48px em gradiente verde com halo, título em
24px peso 700, subtítulo de 14px secundário, ações à direita e — abaixo — uma fileira de
chips de estatística de 10-11px. É o padrão que dá unidade ao app: repita-o em qualquer
superfície nova em vez de inventar um cabeçalho.

## Do's and Don'ts

### Do:
- **Do** usar texto quase-preto (`#0f172a`) sobre qualquer preenchimento verde. Teste: se o
  contraste medido não chega a 4,5:1, o texto está errado, não a cor.
- **Do** reservar o verde neon para sinal — ação, estado ativo, progresso, valor conquistado.
- **Do** delimitar toda superfície de vidro com 1px de verde translúcido.
- **Do** manter a elevação como resposta ao toque: `-translate-y-0.5` mais `shadow-lg` no
  `hover`, nada em repouso.
- **Do** usar brilho verde em vez de sombra preta no tema escuro.
- **Do** repetir o Cabeçalho de Superfície em telas novas, incluindo a fileira de chips.
- **Do** verificar toda mudança nos três temas — `light`, `dark` e `reading` têm cidadania
  igual, e o `reading` é o que mais quebra.
- **Do** usar Space Mono só para valor medido.

### Don't:
- **Don't** usar `text-white` sobre verde, âmbar, laranja ou teal. Use `--on-accent`. A única
  exceção viva no código são os chips de cor de matéria, onde o fundo é escolhido pelo usuário
  e o primeiro plano ainda não é calculado por luminância.
- **Don't** usar `text-primary-500` ou `text-primary-600` como cor de texto: 1,36:1 e 2,16:1
  sobre papel. Existe `--accent-text` para isso.
- **Don't** introduzir uma segunda cor de acento. Os nomes `cyan`, `violet` e `emerald` já
  são verdes neste tema; um gradiente "verde para ciano" é verde para verde.
- **Don't** aplicar sombra preta sobre o fundo `#000000`.
- **Don't** usar texto com gradiente. Está presente hoje em dois lugares
  (`Sidebar.tsx`, `WeeklyPlanner.tsx`) e é dívida, não padrão a seguir.
- **Don't** usar easing de bounce ou elástico. Há um `animate-bounce` remanescente em
  `ChatBubble.tsx`; objetos reais desaceleram, então prefira `ease-out`.
- **Don't** descer abaixo de 10px em texto. A camada micro já é o piso do sistema.
- **Don't** pular passos da escala de canto. São quatro: 8px interno, 12px padrão, 16px de
  contêiner, pílula para o que é circular.
- **Don't** hierarquizar por altura de sombra. A hierarquia é cor, peso e posição.
