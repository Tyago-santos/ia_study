---

# Testes

Todos os módulos da aplicação devem possuir testes automatizados.

## Testes Unitários

Objetivo:

Validar funções, hooks, componentes e regras de negócio de forma isolada.

Devem ser criados para:

- Componentes reutilizáveis
- Hooks customizados
- Funções utilitárias
- Schemas de validação
- Helpers
- Formatações
- Cálculos
- Lógica de negócio

Cobertura esperada:

- Casos de sucesso
- Casos de erro
- Casos extremos (edge cases)

---

## Testes de Integração

Objetivo:

Validar a integração entre componentes, páginas, hooks e chamadas de API.

Devem cobrir:

- Fluxo de autenticação
- Formulários
- Comunicação com a API
- Mutations
- Queries
- Navegação entre páginas
- Estados de loading
- Tratamento de erros

---

## Testes End-to-End (E2E)

Objetivo:

Simular o comportamento real do usuário.

Fluxos mínimos:

- Cadastro
- Login
- Logout
- Recuperação de senha
- Criar matéria
- Iniciar Pomodoro
- Conversar com IA
- Criar Flashcards
- Resolver Quiz
- Gerar Resumo
- Atualizar Perfil
- Alterar Tema
- Visualizar Dashboard

---

## Organização dos Testes

Cada feature deve manter seus próprios testes.

Exemplo:

src/
├── features/
│ └── flashcards/
│ ├── api/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ ├── schemas/
│ ├── services/
│ ├── tests/
│ │ ├── integration/
│ │ └── unit/
│ ├── types/
│ └── index.ts
│
├── shared/
│ ├── components/
│ │ ├── ui/
│ │ ├── common/
│ │ └── layout/
│ ├── hooks/
│ ├── lib/
│ ├── services/
│ ├── store/
│ ├── styles/
│ ├── types/
│ ├── utils/
│ ├── constants/
│ └── tests/
│ ├── unit/
│ └── integration/
│
└── e2e/
├── auth/
├── dashboard/
├── pomodoro/
├── flashcards/
├── quiz/
├── ai/
└── profile/

---

Os testes E2E devem ficar separados.

e2e/
├── auth/
├── dashboard/
├── pomodoro/
├── flashcards/
├── quiz/
├── ai/
└── profile/

---

## Boas Práticas

- Todo bug corrigido deve receber um teste para evitar regressões.
- Novas funcionalidades devem ser entregues com testes.
- Priorizar testes de comportamento em vez de detalhes de implementação.
- Os testes devem ser independentes e não depender da execução de outros testes.
- Utilizar dados de teste isolados e previsíveis.
- Os testes devem ser executados automaticamente no pipeline de CI antes do deploy.

---

## Critérios de Qualidade

- Todos os testes devem passar antes de cada merge.
- Não permitir regressões.
- Manter boa cobertura das funcionalidades críticas.
- Garantir estabilidade da aplicação através da suíte de testes automatizados.
