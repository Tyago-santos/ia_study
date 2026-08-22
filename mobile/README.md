# StudyHub Mobile

App mobile do StudyHub, feito com [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction). A arquitetura por features é a mesma do `frontend/` (React web): `src/features/<feature>/{pages,components,hooks,services,schemas}` para lógica de cada área, e `src/shared/` para o que é comum (API client, stores, tipos, UI kit). As rotas em `src/app/` são só um fino roteador do Expo Router que renderiza as páginas de `src/features/*/pages`.

## Como rodar

1. Suba o backend (`cd ../backend && npm run dev`) — por padrão ele escuta em `http://localhost:3002`.
2. Ajuste `mobile/.env` se necessário:
   - iOS Simulator: `http://localhost:3002` (padrão)
   - Emulador Android: `http://10.0.2.2:3002`
   - Dispositivo físico: `http://<IP-da-sua-máquina>:3002`
3. Instale dependências e inicie:

   ```bash
   npm install
   npx expo start
   ```

   No output do terminal você escolhe abrir num [development build](https://docs.expo.dev/develop/development-builds/introduction/), emulador Android, simulador iOS ou no [Expo Go](https://expo.dev/go).

## O que já está implementado

- Login e cadastro reais contra o backend (`/auth/login`, `/auth/register`), com o token JWT guardado no `expo-secure-store` (sobrevive a fechar o app).
- Sessão restaurada automaticamente na abertura do app (splash fica visível até a hidratação terminar).
- Dashboard consumindo `/users/me` autenticado.
- Perfil com logout.
- Abas de Flashcards, Quiz e IA como placeholders ("Em breve") — ainda não têm backend/telas reais.

## Próximos passos sugeridos

Portar as demais features do `frontend/` (flashcards, quiz, resumos, mapas mentais, cronograma, etc.) seguindo o mesmo padrão: schema em `features/<nome>/schemas`, chamadas de API em `features/<nome>/services`, hooks de React Query em `features/<nome>/hooks`, tela em `features/<nome>/pages`, rota fina em `src/app/(app)/<nome>.tsx`.
