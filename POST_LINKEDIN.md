# Gnosis IA — post para LinkedIn

> Versão pronta para publicar, escrita como projeto concluído.

---

Está no ar. 🚀

Depois de muito código, café e algumas iterações de design, o **Gnosis IA** saiu do papel e virou uma plataforma de estudos completa — com web, Android, iOS e um cérebro de IA por trás.

A ideia nasceu de uma insatisfação simples: usar IA para estudar ainda parecia "abrir um chat, jogar o assunto e torcer para dar certo". Faltava estrutura. Faltava histórico. Faltava um lugar onde o conteúdo gerado virasse matéria, flashcard, quiz, mapa mental e plano de estudo — sem copiar e colar de um lado para o outro.

Então eu construí esse lugar.

**O que a plataforma faz hoje:**

📚 Biblioteca de matérias e tópicos, com progresso por assunto e tudo organizado por usuário;

📝 Resumos inteligentes a partir de texto e PDF, com sugestão de flashcards;

🧠 Flashcards com revisão espaçada de verdade — cada cartão guarda dificuldade, número de revisões e próxima data;

✅ Quizzes gerados pela IA e corrigidos automaticamente, com pontuação e histórico;

🗺️ Mapas mentais editáveis, com nós em árvore, posição, cor e geração automática a partir de um tema;

⏱️ Pomodoro + estatísticas de tempo de estudo, sequência de dias e metas semanais;

📅 Planejador semanal com drag & drop e cronograma de provas/entregas;

💬 Chat com IA com conversas separadas, histórico persistido e respostas em Markdown;

🔐 Autenticação JWT + cookie httpOnly, escopo por usuário em todas as rotas e API REST documentada.

E tudo isso sincronizado entre o navegador e o celular — mesma conta, mesmos dados.

**Como foi construído:**

No backend: Node.js + TypeScript + Express, Prisma com PostgreSQL, integração com Gemini (com rotação automática de chaves quando uma atinge o limite), Docker e deploy no Render.

Na web: React 19, Vite, TanStack Router e Query, Zustand, Tailwind 4, React Flow para os mapas, dnd-kit para o planejador, Recharts para os gráficos e Zod de ponta a ponta.

No mobile: Expo + React Native, expo-router, Reanimated, Secure Store, notificações e até leitura/síntese de voz para os resumos.

Mais do que um app de estudos, isso foi um exercício de arquitetura: três clientes, uma API, um modelo de dados único e a disciplina de manter a experiência consistente em todos os lugares.

Agora quero ouvir você: **se você pudesse escolher a próxima feature, o que entraria primeiro?** Modo foco com bloqueio de distrações? Revisão espaçada com notificações inteligentes? Estudo colaborativo entre amigos?

Comenta aí. 👇

#IA #React #ReactNative #NodeJS #TypeScript #Prisma #PostgreSQL #DesenvolvimentoDeSoftware #Produto #Estudos
