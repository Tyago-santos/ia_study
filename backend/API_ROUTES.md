# Gnosis IA — Referência de Rotas da API

Especificação das **55 rotas** que o backend precisa expor. Complementa
`../FRONTEND_API_CONTRACT.md` (que explica *por que* cada formato é assim); este
documento é a referência de implementação: caminho, método, schema de entrada,
resposta, códigos de status.

**Legenda:** 🔒 exige autenticação · 🆕 rota nova (não existe mock no frontend) ·
🤖 integração com LLM

---

## Convenções

| | |
|---|---|
| Base URL | `http://localhost:3001/api` |
| Prefixo | `app.use('/api', mainRouter)` — hoje falta em `src/app.ts` |
| Auth | `Authorization: Bearer <jwt>` |
| Content-Type | `application/json` |
| Datas | ISO 8601 UTC (`2025-01-15T10:00:00Z`); exceto `date` de cronograma/estatísticas → `YYYY-MM-DD` |
| IDs | **string** em toda serialização |
| Timeout do cliente | 10s — a resposta precisa caber nisso |

### Códigos de status

| Código | Quando |
|---|---|
| `200` | GET, PATCH, PUT, POST de ação (submit, finish, generate) |
| `201` | POST que cria recurso |
| `204` | DELETE (sem corpo) — exceto `DELETE /mindmaps/:id` |
| `400` | Falha de validação Zod |
| `401` | Token ausente, inválido ou expirado |
| `403` | Recurso pertence a outro usuário |
| `404` | Recurso inexistente |
| `409` | Conflito (email já cadastrado) |
| `500` | Erro interno |

### Formato de erro

Todo erro devolve JSON com `message` — os hooks do frontend exibem esse campo em toast:

```jsonc
{ "message": "Email ou senha inválidos" }

// validação (400)
{
  "message": "Dados inválidos",
  "errors": { "email": "Email inválido", "password": "Mínimo 6 caracteres" }
}
```

### Regra transversal de escopo

Nenhum tipo do frontend carrega `userId`. **Todo recurso é filtrado pelo usuário do
token**, e todo `subjectId`/`:id` recebido do cliente precisa ter a posse verificada
antes do uso. Um `GET /flashcards?subjectId=X` onde `X` é de outro usuário deve
devolver lista vazia ou `403` — nunca os dados.

---

## Índice de rotas

### Auth — `/auth`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| POST | `/auth/register` | | Cria conta e já devolve token |
| POST | `/auth/login` | | Autentica |
| GET | `/auth/me` | 🔒🆕 | Reidrata usuário após reload |

### Matérias — `/subjects`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/subjects` | 🔒 | Lista todas |
| POST | `/subjects` | 🔒 | Cria |
| DELETE | `/subjects/:id` | 🔒 | Remove (cascata) |

### Tópicos — `/topics`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/topics` | 🔒 | Lista **todos**, sem filtro |
| POST | `/topics` | 🔒 | Cria |
| PATCH | `/topics/:id/toggle` | 🔒 | Inverte `completed` |
| DELETE | `/topics/:id` | 🔒 | Remove |

### Flashcards — `/flashcards`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/flashcards` | 🔒 | Lista **paginada** |
| POST | `/flashcards` | 🔒 | Cria |
| DELETE | `/flashcards/:id` | 🔒 | Remove |

### Quiz — `/quiz`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/quiz` | 🔒 | Lista |
| POST | `/quiz` | 🔒 | Cria |
| POST | `/quiz/generate` | 🔒🤖 | Gera com IA |
| POST | `/quiz/:id/submit` | 🔒 | Corrige respostas |

### Resumos — `/summaries`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/summaries` | 🔒 | Lista |
| POST | `/summaries` | 🔒 | Cria |
| POST | `/summaries/generate` | 🔒🤖 | Gera texto (não persiste) |
| POST | `/summaries/:id/flashcards` | 🔒🤖 | Sugere flashcards (não persiste) |

### Mapas mentais — `/mindmaps`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/mindmaps` | 🔒 | Lista |
| GET | `/mindmaps/:id` | 🔒 | Detalhe |
| POST | `/mindmaps` | 🔒 | Cria |
| POST | `/mindmaps/generate` | 🔒🤖 | Gera nós com IA |
| PUT | `/mindmaps/:id/nodes` | 🔒 | Substitui array de nós |
| DELETE | `/mindmaps/:id` | 🔒 | Remove — **devolve `{id}`, não 204** |

### Cronograma — `/schedule`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/schedule` | 🔒 | Lista ordenada por data |
| POST | `/schedule` | 🔒 | Cria |
| PATCH | `/schedule/:id/toggle` | 🔒 | Inverte `completed` |
| DELETE | `/schedule/:id` | 🔒 | Remove |

### Sessões de estudo — `/sessions`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| POST | `/sessions/start` | 🔒 | Inicia |
| POST | `/sessions/:id/finish` | 🔒 | Finaliza e devolve agregados |
| POST | `/sessions/:id/cancel` | 🔒 | Descarta |

### Perfil — `/profile`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/profile` | 🔒 | Dados do usuário |
| PATCH | `/profile` | 🔒 | Atualiza parcialmente |

### Gamificação — `/gamification`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/gamification/profile` | 🔒 | Nível, XP, streak |
| GET | `/gamification/achievements` | 🔒 | Conquistas |
| GET | `/gamification/missions` | 🔒 | Missões |

### Estatísticas — `/stats`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/stats/dashboard` | 🔒 | Cards do topo |
| GET | `/stats/daily` | 🔒🆕 | Série diária (gráficos) |
| GET | `/stats/subjects` | 🔒 | Minutos por matéria |
| GET | `/stats/contributions` | 🔒 | Calendário anual (371 dias) |
| GET | `/stats/pomodoro` | 🔒 | Totais de pomodoro |
| GET | `/stats/quiz` | 🔒 | Desempenho em quizzes |
| GET | `/stats/flashcards` | 🔒 | Totais de flashcards |

### Atividades — `/activities`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/activities` | 🔒🆕 | Timeline do dashboard |

### Chat IA — `/ai`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/ai/conversations` | 🔒 | Lista conversas |
| POST | `/ai/conversations` | 🔒 | Cria conversa |
| GET | `/ai/conversations/:id/messages` | 🔒 | Mensagens |
| POST | `/ai/conversations/:id/messages` | 🔒🤖 | Envia e recebe resposta |

### Configurações — `/settings`
| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| GET | `/settings` | 🔒 | Preferências |
| PATCH | `/settings` | 🔒 | Atualiza |

---

## 1. Auth

### `POST /auth/register` → `201`

```ts
const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})
```

O frontend valida `confirmPassword` no cliente e **não o envia**.

```jsonc
// 201
{
  "user": { "id": "u1", "name": "Tiago Almeida", "email": "tiago@example.com",
            "bio": "", "avatar": "", "createdAt": "2025-01-15T10:00:00Z" },
  "token": "<jwt>"
}
```

Erros: `400` validação · `409` email já cadastrado.

> O frontend faz **login automático** após o cadastro. O token precisa ser válido
> imediatamente — não devolva token só após confirmação de email.

### `POST /auth/login` → `200`

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```

Resposta idêntica ao register: `{ user, token }`.
Erros: `401` credenciais inválidas (mesma mensagem para email inexistente e senha
errada, para não vazar quais emails existem).

### `GET /auth/me` 🔒🆕 → `200`

Devolve `User`. Rota nova, mas necessária: o token persiste em `localStorage` e
sobrevive ao reload, porém o objeto `user` no Zustand volta `null`. Sem ela, o
frontend contorna com `localStorage['studyhub-mock-user']`.

Erros: `401` token inválido/expirado.

**Payload do JWT** — o `express.d.ts` já declara `Request.user`:

```ts
{ id: string, email: string }   // hoje o d.ts diz `id: number` — corrija para string
```

---

## 2. Matérias

### `GET /subjects` 🔒 → `200`

Retorna `Subject[]` — **array puro**, sem envelope.

```jsonc
[{ "id": "s1", "name": "Calculo I", "color": "#00ff00",
   "icon": "Calculator", "createdAt": "2025-01-15T10:00:00Z" }]
```

`icon` é nome de ícone do `lucide-react` (ver `shared/constants/subjectIcons.ts`).

### `POST /subjects` 🔒 → `201`

```ts
z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  icon: z.string().optional(),
})
```

Devolve o `Subject` criado.

### `DELETE /subjects/:id` 🔒 → `204`

**Defina a cascata.** `topics`, `flashcards`, `quizzes`, `summaries`, `mindmaps` e
`schedule_events` referenciam `subjectId`; o frontend não trata registros órfãos.
Recomendo `ON DELETE CASCADE`.

Erros: `404` · `403`.

---

## 3. Tópicos

### `GET /topics` 🔒 → `200`

Retorna `Topic[]` com **todos os tópicos do usuário**, de todas as matérias. O
cliente agrupa por `subjectId` em memória (`useTopics` + `SubjectDetail`). Não há
filtro por query string aqui.

### `POST /topics` 🔒 → `201`

```ts
z.object({ subjectId: z.string(), name: z.string().min(1) })
```

`completed` nasce `false`. Devolve o `Topic`.

### `PATCH /topics/:id/toggle` 🔒 → `200`

Sem corpo. Inverte `completed` **no servidor** (não receba o valor do cliente) e
devolve o `Topic` inteiro atualizado.

### `DELETE /topics/:id` 🔒 → `204`

---

## 4. Flashcards

### `GET /flashcards` 🔒 → `200`

```ts
z.object({
  subjectId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(20),
})
```

**Único módulo paginado.** Resposta envelopada:

```jsonc
{ "flashcards": [ /* Flashcard[] */ ], "total": 42 }
```

`total` é a contagem **após** o filtro de `subjectId`, não o total geral — é o que
alimenta o contador da tela e o cálculo de páginas.

> A busca global chama `?limit=1000` para carregar a coleção inteira. Se o `max`
> for menor que isso, flashcards existentes somem da busca.

### `POST /flashcards` 🔒 → `201`

```ts
z.object({
  subjectId: z.string(),
  front: z.string().min(1),
  back: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
})
```

Valores iniciais do servidor: `reviewCount: 0`, `nextReview` = agora.

### `DELETE /flashcards/:id` 🔒 → `204`

A UI usa exclusão com janela de undo (`useUndoableDelete`): remove do cache
otimisticamente e só chama o DELETE quando a janela fecha. Para o backend é uma
exclusão comum.

---

## 5. Quiz

### `GET /quiz` 🔒 → `200`

Query opcional `?subjectId=`. Retorna `Quiz[]` com as questões embutidas.

> As questões trazem `correctAnswer`. Como a correção acontece no servidor
> (`/submit`), considere **omitir `correctAnswer` em quizzes ainda não respondidos** —
> qualquer usuário pode ler a resposta no DevTools. O tipo do frontend exige o campo;
> enviar `-1` como placeholder resolve sem quebrar a tipagem. Só é gabarito legítimo
> depois que `completedAt` existe.

### `POST /quiz` 🔒 → `201`

```ts
z.object({
  subjectId: z.string(),
  title: z.string().min(1),
  questions: z.array(z.object({
    question: z.string().min(1),
    options: z.array(z.string()).min(2),
    correctAnswer: z.number().int().nonnegative(),
  })).min(1),
})
```

O backend gera o `id` de cada questão. Valide que `correctAnswer < options.length`.

### `POST /quiz/generate` 🔒🤖 → `201`

```ts
z.object({ subjectId: z.string(), topic: z.string().optional() })
```

Devolve um `Quiz` completo e **já persistido**. Título padrão quando não há tópico:
`"Quiz Gerado por IA"`; com tópico: `"Quiz: <topic>"`.

### `POST /quiz/:id/submit` 🔒 → `200`

Entrada é um **mapa de `questionId` → índice da opção escolhida**:

```ts
z.object({ answers: z.record(z.string(), z.number().int().nonnegative()) })
```

```jsonc
// request
{ "answers": { "qq1": 2, "qq2": 0 } }

// 200
{
  "score": 8,
  "total": 10,
  "percentage": 80,
  "quiz": { /* Quiz com userAnswer preenchido, score e completedAt */ }
}
```

**`score` ≠ `Quiz.score`:** o `score` da raiz é a contagem de acertos; o `score`
dentro de `quiz` é o percentual. `QuizResult` e `ScoreRing` usam os dois.
`percentage = round(acertos / total * 100)`.

---

## 6. Resumos

### `GET /summaries` 🔒 → `200`

Query opcional `?subjectId=`. Retorna `Summary[]`.

### `POST /summaries` 🔒 → `201`

```ts
z.object({
  subjectId: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  sourceType: z.enum(['text', 'pdf', 'image']),
})
```

### `POST /summaries/generate` 🔒🤖 → `200`

```ts
z.object({ content: z.string().min(1), sourceType: z.string() })
```

```jsonc
{ "summary": "texto gerado..." }
```

Devolve **só o texto**, não um `Summary`. Nada é persistido — o usuário revisa e
depois chama `POST /summaries`.

### `POST /summaries/:id/flashcards` 🔒🤖 → `200`

Sem corpo. Sugere flashcards a partir do resumo:

```jsonc
{ "flashcards": [ { "front": "...", "back": "..." } ] }
```

Pares soltos, **sem `id` e sem `subjectId`** — também não persiste. Criar de fato é
`POST /flashcards`, um por um.

> `sourceType: 'pdf' | 'image'` implica upload de arquivo, e o `api.ts` do frontend
> só envia JSON (força `Content-Type: application/json`). Upload exige endpoint
> `multipart` próprio **e** um método novo no cliente HTTP.

---

## 7. Mapas mentais

### `GET /mindmaps` 🔒 → `200`

Query opcional `?subjectId=`. Retorna `MindMap[]` com os nós embutidos.

### `GET /mindmaps/:id` 🔒 → `200`

Retorna um `MindMap`. Erros: `404`.

### `POST /mindmaps` 🔒 → `201`

```ts
const nodeSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  label: z.string(),
  note: z.string().optional(),
  color: z.string().optional(),
  collapsed: z.boolean().optional(),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
})

z.object({
  subjectId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  nodes: z.array(nodeSchema).optional(),
})
```

Sem `nodes`, o cliente já monta os nós iniciais (`createStarterNodes`) antes de
enviar — o backend não precisa gerar nada.

### `POST /mindmaps/generate` 🔒🤖 → `200`

```ts
z.object({ topic: z.string().min(1), content: z.string().optional() })
```

```jsonc
{ "nodes": [ /* MindMapNode[] */ ] }
```

Devolve só os nós, sem criar mapa. **Contrato da árvore:** lista plana, exatamente
uma raiz (`parentId: null`), todo outro `parentId` apontando para um `id` presente
no array, sem ciclos. O layout é calculado no cliente — não envie `position` em nós
gerados.

### `PUT /mindmaps/:id/nodes` 🔒 → `200`

```ts
z.object({ id: z.string(), nodes: z.array(nodeSchema) })
```

**Substitui o array inteiro.** É assim que toda edição do canvas é salva: criar nó,
mover, renomear, colapsar, excluir subárvore. Atualize `updatedAt` e devolva o
`MindMap` completo.

Persistir como coluna JSON é suficiente — o cliente sempre manda tudo.

### `DELETE /mindmaps/:id` 🔒 → `200`

```jsonc
{ "id": "mm1" }
```

**Exceção do projeto:** devolve corpo, não `204`. Se preferir padronizar em 204,
ajuste `mindmaps.service.ts` no frontend junto.

---

## 8. Cronograma

### `GET /schedule` 🔒 → `200`

Query opcional `?subjectId=`. Retorna `ScheduleEvent[]`
**ordenado por `date` ascendente** — a UI depende dessa ordem.

### `POST /schedule` 🔒 → `201`

```ts
z.object({
  title: z.string().min(1),
  type: z.enum(['prova', 'estudo', 'trabalho', 'outro']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  subjectId: z.string().optional(),
  description: z.string().optional(),
})
```

`date` é **`YYYY-MM-DD`**, sem hora — não devolva timestamp completo aqui.
`completed` nasce `false`.

### `PATCH /schedule/:id/toggle` 🔒 → `200`

Sem corpo. Inverte `completed`, devolve o evento atualizado.

### `DELETE /schedule/:id` 🔒 → `204`

---

## 9. Sessões de estudo

O timer roda **inteiramente no cliente** (`features/pomodoro/lib/timer.ts` + store
Zustand persistida). O backend só registra início e fim.

### `POST /sessions/start` 🔒 → `201`

```ts
z.object({ subjectId: z.string(), type: z.enum(['pomodoro', 'free']) })
```

Devolve `StudySession` com `duration: 0`, `startedAt` = agora e `completedAt` nulo.

> O tipo `StudySession` do frontend declara `completedAt: string` (obrigatório).
> Se devolver `null`, ajuste para `completedAt: string | null` em
> `shared/types/index.ts`.

### `POST /sessions/:id/finish` 🔒 → `200`

Sem corpo. O servidor calcula a duração — **não confie em duração enviada pelo
cliente**, é o número que alimenta todas as estatísticas e gamificação.

```jsonc
{
  "session": { /* StudySession com duration e completedAt */ },
  "todayTotal": 75,
  "weekTotal": 480
}
```

`duration` em **minutos inteiros** (`round((completedAt - startedAt) / 60000)`).
`todayTotal` e `weekTotal` são somas de minutos do dia e da semana do usuário.

Erros: `404` · `409` se a sessão já foi finalizada.

### `POST /sessions/:id/cancel` 🔒 → `204`

Descarta a sessão. Não deve contar em estatística nenhuma.

---

## 10. Perfil

### `GET /profile` 🔒 → `200`

Retorna `User`. Pode ser o mesmo handler de `GET /auth/me`.

### `PATCH /profile` 🔒 → `200`

```ts
z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
})
```

Devolve o `User` **completo** após o merge, não só os campos alterados.
`email` e `password` não são editáveis por esta rota.

---

## 11. Gamificação

Somente leitura — a progressão é calculada pelo backend a partir das sessões,
quizzes e flashcards. O frontend apenas exibe. Não há tipos em `shared/types` para
esses três formatos; mudanças exigem ajustar
`features/gamification/components/`.

### `GET /gamification/profile` 🔒 → `200`

```jsonc
{ "level": 5, "xp": 340, "xpToNextLevel": 500, "streak": 7 }
```

`xp` é o acumulado **dentro do nível atual**; a barra de progresso é
`xp / xpToNextLevel`. `streak` em dias consecutivos.

### `GET /gamification/achievements` 🔒 → `200`

```jsonc
[{
  "id": "ach1",
  "name": "Primeira Sessao",
  "description": "Complete sua primeira sessao de estudo",
  "unlocked": true,
  "unlockedAt": "2025-01-15T10:00:00Z"
}]
```

Devolve **todas** as conquistas, bloqueadas inclusive — a tela mostra as duas
categorias. `unlockedAt` é omitido quando `unlocked: false`.

### `GET /gamification/missions` 🔒 → `200`

```jsonc
[{ "id": "m1", "name": "Estudar 2h hoje", "progress": 75,
   "total": 120, "xp": 50, "completed": false }]
```

`progress` e `total` na mesma unidade (minutos, contagem — o que a missão medir).
`xp` é a recompensa.

---

## 12. Estatísticas

Quase tudo aqui sai de `study_sessions`. Indexe por `(user_id, completed_at)`.

### `GET /stats/dashboard` 🔒 → `200`

```jsonc
{
  "todayMinutes": 75,
  "weekMinutes": 580,
  "monthMinutes": 2340,
  "streak": 7,
  "weeklyGoal": 600,
  "weeklyGoalProgress": 97
}
```

`weeklyGoalProgress = round(weekMinutes / weeklyGoal * 100)` — pode passar de 100.

### `GET /stats/daily` 🔒🆕 → `200`

```ts
z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})
```

```jsonc
[{ "date": "2025-07-20", "minutes": 45, "pomodoros": 2 }]
```

Rota nova, exigida pelo dashboard (hoje ele lê os mocks direto). **Um item por dia
do intervalo, incluindo dias zerados** — os gráficos não preenchem lacunas.

### `GET /stats/subjects` 🔒 → `200`

```jsonc
[{ "subjectId": "s1", "subjectName": "Calculo I",
   "totalMinutes": 480, "sessions": 18 }]
```

`subjectName` vem desnormalizado — o donut chart usa direto, sem cruzar com
`/subjects`.

### `GET /stats/contributions` 🔒 → `200`

`DailyStats[]` com **371 dias** (um ano + folga para fechar as colunas de semana do
calendário estilo GitHub). Um item por dia, dias zerados incluídos.

### `GET /stats/pomodoro` 🔒 → `200`

```jsonc
{ "totalPomodoros": 48, "totalTime": 1260 }
```

`totalTime` em minutos.

### `GET /stats/quiz` 🔒 → `200`

```jsonc
{ "average": 85, "total": 12, "bestStreak": 5 }
```

`average` = percentual médio de acerto nos quizzes concluídos. `bestStreak` = maior
sequência de quizzes com 100%.

### `GET /stats/flashcards` 🔒 → `200`

```jsonc
{ "total": 24, "reviewed": 18, "due": 6 }
```

`due` = cards com `nextReview <= agora`.

---

## 13. Atividades

### `GET /activities` 🔒🆕 → `200`

```ts
z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(['pomodoro', 'quiz', 'flashcard', 'summary']).array().optional(),
  subjectId: z.string().array().optional(),
})
```

```jsonc
[{
  "id": "a1",
  "type": "pomodoro",
  "title": "Sessao de Calculo",
  "description": "25 min - Calculo I",
  "subjectId": "s1",
  "createdAt": "2025-07-26T08:25:00Z"
}]
```

Rota nova, alimenta o `ActivityTimeline`. Note o **`subjectId`, que não está na
interface `Activity`** de `shared/types` mas é usado para filtrar — inclua no
payload.

Ordene por `createdAt` decrescente. `type` e `subjectId` são filtros de **lista**
(múltiplos valores). Pode ser uma view derivada de sessões/quizzes/flashcards/
resumos em vez de tabela própria.

---

## 14. Chat com IA

### `GET /ai/conversations` 🔒 → `200`

`Conversation[]`. Para a lista lateral, `messages: []` é aceitável — a tela busca as
mensagens sob demanda.

### `POST /ai/conversations` 🔒 → `201`

```ts
z.object({ title: z.string().optional() })
```

Sem título → `"Nova Conversa"`. Devolve a `Conversation` com `messages: []`.

### `GET /ai/conversations/:id/messages` 🔒 → `200`

`ChatMessage[]` em ordem cronológica ascendente.

### `POST /ai/conversations/:id/messages` 🔒🤖 → `200`

```ts
z.object({ content: z.string().min(1) })
```

Devolve **apenas a `ChatMessage` do assistente**:

```jsonc
{ "id": "m2", "content": "resposta...", "role": "assistant",
  "createdAt": "2025-07-28T10:00:01Z" }
```

O backend persiste as duas mensagens (usuário e assistente) e atualiza `updatedAt`
da conversa; a mensagem do usuário já foi adicionada otimisticamente na UI.

**Sem streaming.** É requisição única, e o `api.ts` aborta em 10s — ver §16.

---

## 15. Configurações

### `GET /settings` 🔒 → `200`

```jsonc
{
  "theme": "light",
  "fontSize": "medium",
  "language": "pt-BR",
  "notifications": true,
  "pomodoro": { "focus": 25, "shortBreak": 5, "longBreak": 15 }
}
```

`theme`: `'light' | 'dark' | 'reading'`. Durações do pomodoro em minutos.
Se o usuário nunca salvou nada, devolva esses padrões — não devolva `404`.

### `PATCH /settings` 🔒 → `200`

```ts
z.object({
  theme: z.enum(['light', 'dark', 'reading']).optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
  language: z.string().optional(),
  notifications: z.boolean().optional(),
  pomodoro: z.object({
    focus: z.number().int().positive(),
    shortBreak: z.number().int().positive(),
    longBreak: z.number().int().positive(),
  }).optional(),
})
```

Patch parcial; devolve o objeto **inteiro** após o merge.

O tema também vive no Zustand (`shared/store/theme.ts`) para aplicar sem esperar a
rede — o backend é a persistência entre dispositivos.

---

## 16. Rotas de IA: o problema do timeout

As seis rotas 🤖 chamam um LLM. O `api.ts` do frontend aborta em **10 segundos**
(`AbortSignal.timeout(10000)`), o que geração real costuma estourar.

| Saída | Custo | Quando |
|---|---|---|
| Aumentar o timeout no `api.ts` | 1 linha; UI fica travada esperando | começar por aqui |
| SSE / streaming | refatorar `api.ts` (hoje só faz `fetch` + `.json()`) | só o chat, depois |
| Job assíncrono (`202` + `jobId` + polling) | mais complexo dos dois lados | gerações longas |

Recomendo o timeout maior agora e streaming só no chat, quando o resto estiver de pé.

---

## 17. Estrutura de arquivos sugerida

Seguindo o padrão já iniciado em `src/modules/auth/`, espelhando o feature-first do
frontend:

```
backend/src/
├── server.ts
├── app.ts                      # + app.use('/api', mainRouter)
├── router.ts                   # monta os 15 módulos
├── config/
│   ├── env.ts
│   └── database.ts             # a definir (Prisma/Drizzle/pg)
├── shared/
│   ├── middlewares/
│   │   ├── requireAuth.ts      # verifica JWT, popula req.user
│   │   ├── validate.ts         # valida body/query com Zod
│   │   └── errorHandler.ts     # traduz erro → JSON { message }
│   ├── errors/AppError.ts
│   └── types/express.d.ts      # id: string (hoje number)
└── modules/
    ├── auth/          { router.ts, controller/, service/, schemas.ts }
    ├── subjects/
    ├── topics/
    ├── flashcards/
    ├── quiz/
    ├── summaries/
    ├── mindmaps/
    ├── schedule/
    ├── sessions/
    ├── profile/
    ├── gamification/
    ├── stats/
    ├── activities/
    ├── ai/
    └── settings/
```

### `src/router.ts`

```ts
import { Router } from 'express'
import { requireAuth } from './shared/middlewares/requireAuth.js'
import { routerAuth } from './modules/auth/router.js'
import { routerSubjects } from './modules/subjects/router.js'
// ...demais imports

const router = Router()

router.use('/auth', routerAuth)          // público (exceto /me, protegido dentro)

router.use(requireAuth)                  // tudo abaixo exige token

router.use('/subjects', routerSubjects)
router.use('/topics', routerTopics)
router.use('/flashcards', routerFlashcards)
router.use('/quiz', routerQuiz)
router.use('/summaries', routerSummaries)
router.use('/mindmaps', routerMindmaps)
router.use('/schedule', routerSchedule)
router.use('/sessions', routerSessions)
router.use('/profile', routerProfile)
router.use('/gamification', routerGamification)
router.use('/stats', routerStats)
router.use('/activities', routerActivities)
router.use('/ai', routerAi)
router.use('/settings', routerSettings)

export { router as mainRouter }
```

### Exemplo de router de módulo

```ts
// src/modules/flashcards/router.ts
import { Router } from 'express'
import { validate } from '../../shared/middlewares/validate.js'
import { FlashcardsController } from './controller/index.js'
import { createFlashcardSchema, listFlashcardsSchema } from './schemas.js'

const router = Router()
const controller = new FlashcardsController()

router.get('/', validate({ query: listFlashcardsSchema }), controller.list)
router.post('/', validate({ body: createFlashcardSchema }), controller.create)
router.delete('/:id', controller.remove)

export { router as routerFlashcards }
```

### Ordem de rotas no Express

Registre caminhos estáticos **antes** de paramétricos dentro do mesmo módulo:

```ts
router.post('/generate', controller.generate)      // antes
router.post('/:id/submit', controller.submit)      // depois
```

---

## 18. Correções pendentes no backend atual

Antes de escrever qualquer rota nova:

| # | Arquivo | Problema |
|---|---|---|
| 1 | `.env` | **`SECRET_KEY` ausente** — `config/env.ts` exige e o servidor lança no boot |
| 2 | `.env` / frontend | Porta 3000 no backend vs. 3001 esperada pelo frontend |
| 3 | `src/app.ts` | `app.use(mainRouter)` sem o prefixo `/api` |
| 4 | `src/modules/auth/*` | Typo `regiter` → `register` |
| 5 | `src/modules/auth/controller/` | `login` devolve `{ok: true}`; `register` não responde (pendura até o timeout) |
| 6 | `src/app.ts` | `import expres from "express"` |
| 7 | `src/shared/types/express.d.ts` | `id: number` — o frontend usa string |
| 8 | `src/server.ts` | Log com porta fixa no texto, ignora `env.PORT` |
| 9 | — | Sem ORM/driver de banco nas dependências |
| 10 | `src/app.ts` | `cookie-parser` registrado sem uso — decidir localStorage vs. cookie httpOnly **antes** de implementar auth |

Decisões a tomar agora, porque mudam o frontend depois:

- **Token em localStorage ou cookie httpOnly?** Cookie é mais seguro (imune a XSS),
  mas exige `credentials: 'include'` no `api.ts`, `cors({ origin, credentials: true })`
  e remover o `getToken()`.
- **ID string ou number?** Todos os tipos do frontend usam `string`.
- **Cascata ao deletar matéria.**

---

## 19. Ordem de implementação

| Fase | Módulos | Motivo |
|---|---|---|
| 1 | correções §18 + `requireAuth` + `errorHandler` | nada funciona antes disso |
| 2 | `auth`, `profile` | tudo depende do token |
| 3 | `subjects`, `topics` | quase todo recurso referencia `subjectId` |
| 4 | `flashcards`, `quiz`, `summaries`, `schedule` | CRUDs independentes |
| 5 | `mindmaps` | JSON de nós, mais isolado |
| 6 | `sessions` | base das estatísticas |
| 7 | `stats`, `activities` | dependem de sessões acumuladas |
| 8 | `gamification`, `settings` | derivados |
| 9 | `ai` (4 rotas 🤖) | integração externa, deixe por último |

Cada módulo pode ser ligado ao frontend isoladamente: troque o service
correspondente por chamadas ao `api` e os demais seguem nos mocks. A aplicação
continua funcionando durante toda a migração.
