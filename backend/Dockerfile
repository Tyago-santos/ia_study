# syntax=docker/dockerfile:1

# Debian slim (e não Alpine) porque o bcrypt é um módulo nativo e
# não publica prebuilds para musl — em Alpine ele exigiria toolchain C++.
ARG NODE_VERSION=25-bookworm-slim

# ---------------------------------------------------------------------------
# deps: dependências completas (dev incluídas) para compilar o projeto
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# build: gera o Prisma Client e empacota o servidor em dist/
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS build
WORKDIR /app

# O CLI do Prisma procura libssl para o schema engine.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# prisma.config.ts importa src/config/env.ts, que valida as variáveis com zod.
# Estes valores existem só para o `prisma generate` passar na validação durante
# o build; nenhum deles chega à imagem final (estágio separado).
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    JWT_SECRET="build-time-placeholder" \
    COOKIE_SECRET="build-time-placeholder"

RUN npx prisma generate

# Não usamos `npm run build`: o `--dts` daquele script quebra com TypeScript 7
# (rollup-plugin-dts). Declarations são inúteis para um servidor, então
# empacotamos apenas o bundle ESM que o `node dist/server.js` consome.
RUN npx tsup src/server.ts --format esm

# ---------------------------------------------------------------------------
# prod-deps: node_modules sem devDependencies para o runtime
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------------------------------------------------------------------------
# runtime: imagem final
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Schema e config do Prisma: necessários para rodar `prisma migrate deploy`
# a partir do container. `prisma.config.ts` importa `src/config/env.ts`,
# por isso `src` também precisa estar presente.
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
