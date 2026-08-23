# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Decisão em aberto.** O foco de público ainda não foi definido — a plataforma atende
hoje, sem priorizar nenhum: universitário, concurseiro/ENEM e autodidata.

O que o repositório evidencia (hipótese, não decisão confirmada): as matérias de exemplo
são Cálculo I, Física, Química, Programação e História, e o perfil mockado diz "Estudante
de Engenharia" — ou seja, o produto foi prototipado com o universitário em mente.

Trabalhos futuros não devem assumir um perfil único. Mecânicas que só servem a um
segmento (contagem regressiva de edital, ciclo de revisão por peso de prova, grade
curricular por semestre) precisam ser opcionais até que este campo seja decidido.

## Product Purpose

Reunir num só lugar as ferramentas que um estudante hoje espalha por vários aplicativos:
cronômetro de foco, flashcards, quizzes, resumos, mapas mentais, cronograma e métricas de
evolução — com IA atuando como tutor dentro do mesmo ambiente.

Sucesso, conforme os objetivos declarados em `.specs-kit/specs/ spec.md`: aumentar
produtividade, melhorar retenção, incentivar consistência dos estudos e dar ao aluno
métricas detalhadas da própria evolução.

## Positioning

A tese declarada é **centralização + IA como tutor**: o aluno não troca de ferramenta
entre estudar, revisar, testar-se e acompanhar progresso.

**Fato a registrar honestamente:** centralização é uma tese de conveniência, não um
mecanismo defensável — um concorrente pode copiá-la. Nenhum mecanismo proprietário foi
estabelecido até aqui. Definir isso é uma decisão em aberto, e trabalhos futuros não devem
alegar diferencial que o produto ainda não tem.

## Operating Context

Fluxo de estudo esperado (`plan.md`): escolher matéria → iniciar Pomodoro → fazer
anotações → perguntar à IA → gerar flashcards → resolver quiz → ver estatísticas.

Fluxo de primeiro acesso (`plan.md`): criar conta → configurar perfil → escolher objetivo
de estudo → criar primeira matéria → iniciar primeiro Pomodoro.

Encadeamento factual do Pomodoro: ao concluir, a sessão grava tempo estudado e atualiza
dashboard, ofensiva e calendário de contribuições. Qualquer trabalho que toque no Pomodoro
preserva essa cadeia.

Interface e rotas em pt-BR (`/cronograma`, `/biblioteca`, `/estatisticas`,
`/mapas-mentais`). Identificadores de código em inglês — convenção registrada em comentário
no `src/router.tsx`.

## Capabilities and Constraints

**Superfícies implementadas:** login/cadastro, dashboard (com planner semanal
drag-and-drop), Pomodoro, chat IA, flashcards, quiz, resumos, mapas mentais, biblioteca de
matérias/tópicos, gamificação, estatísticas, perfil, configurações.

**Dados são mocks em memória.** Todos os services operam sobre arrays a nível de módulo
(`src/shared/mocks/data.ts`); recarregar a página descarta o que foi criado. A única
persistência real é a sessão de autenticação em `localStorage`.

**Backend planejado, não construído.** `.env.example` aponta `VITE_API_URL` para
`http://localhost:3001/api` e documenta que, sem backend, a aplicação mostra estados de
erro amigáveis.

**IA: integração real planejada (confirmado).** Hoje as respostas são simuladas
(`ai.service.ts` devolve texto fixo; geradores de resumo, flashcards e mapa mental montam
estrutura local). O design precisa prever latência, streaming, cancelamento e falha de
modelo — não tratar a resposta como instantânea e infalível.

**Lacunas entre o especificado e o implementado**, que não devem ser apresentadas como
prontas: login com Google e GitHub são exigidos pelo `spec.md` e existem como botões
renderizados, porém sem handler; recuperação de senha é exigida e não existe.

**Testes:** `structure.md` exige testes unitários, de integração e E2E em todos os módulos.
Não há runner configurado nem nenhum arquivo de teste no projeto.

**Stack (restrição técnica):** React 19, Vite 8, TypeScript, TanStack Router, TanStack
Query, Zustand, Tailwind CSS v4, Recharts, `@xyflow/react`, `react-hook-form` + Zod,
`sonner`, `@hello-pangea/dnd`, ícones Lucide. Três temas: `light`, `dark`, `reading`.

**Destino do projeto: decisão em aberto.** Não foi decidido se isto é portfólio, produto
para lançar ou ferramenta de uso pessoal. Isso muda prioridades (vitrine vs. ativação e
acessibilidade vs. atrito diário), então trabalhos futuros não devem presumir.

## Brand Commitments

Nome confirmado: **Gnosis IA** (`index.html`, sidebar).

Ativos existentes: `public/favicon.svg`, `public/icons.svg`, `src/assets/hero.png`.
Tipografia carregada hoje: Roboto e Space Mono via Google Fonts.

O usuário não declarou nenhuma restrição visual como vinculante. O sistema visual atual
(paleta verde neon, três temas, bordas glass) é **implementação incumbente — evidência, não
compromisso de marca**. Registrar como identidade obrigatória exige decisão explícita.

## Evidence on Hand

- Documentos de produto: `.specs-kit/specs/ spec.md` (visão, problema, requisitos,
  critérios de aceitação), `plan.md` (fluxos, módulos, roadmap MVP/V2), `structure.md`
  (exigências de teste), `tasks.md`.
- Dataset de exemplo em `src/shared/mocks/data.ts`: 5 matérias, 9 tópicos, sessões de
  estudo, flashcards, quizzes, resumos, mapas mentais, eventos de cronograma, atividade
  anual gerada e dados de gamificação.
- Ativos gráficos listados em Brand Commitments.

**Ausências que trabalhos futuros não devem fabricar:** não há usuários reais, depoimentos,
estudos de caso, imprensa, benchmarks, preço, licenciamento, deploy, analytics nem backend.
Todo número visível na interface hoje é mock.

## Product Principles

1. **Não presumir público.** Enquanto o foco não for decidido, nenhuma mecânica específica
   de um segmento entra como caminho obrigatório.
2. **Centralização é a razão de existir.** Cada funcionalidade nova precisa reduzir a
   necessidade de abrir outro aplicativo; se não reduz, não pertence ao produto.
3. **Toda sessão de estudo alimenta as métricas.** Estudar e medir são o mesmo gesto — a
   cadeia Pomodoro → dashboard → ofensiva → calendário é product truth, não detalhe.
4. **A IA é capacidade real pendente de backend.** A interface prevê espera e falha, e não
   promete ao usuário mais do que o modelo entrega.
5. **Nada de dado fabricado apresentado como fato do usuário.** Os mocks são andaime de
   desenvolvimento; nenhum número simulado deve ser exibido como conquista real.

## Accessibility & Inclusion

`spec.md` lista "boa acessibilidade" entre os critérios de qualidade, sem fixar padrão nem
nível — nenhuma norma específica (ex.: WCAG 2.2 AA) foi estabelecida como requisito.

Fato relevante e não resolvido: a interface é integralmente em pt-BR, mas `index.html`
declara `lang="en"`. Leitores de tela usarão pronúncia errada até que isso seja corrigido.

O tema `reading` (fundo âmbar, contraste reduzido) existe como acomodação de leitura
prolongada; nenhuma necessidade de usuário específica foi confirmada como origem dele.
