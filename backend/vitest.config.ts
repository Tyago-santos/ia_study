import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    // Garante que config/env.ts passe no parse durante os testes, sem depender
    // do .env da maquina. Os dois nomes de segredo estao aqui de proposito:
    // config/env.ts exige SECRET_KEY e o .env define JWT_SECRET.
    env: {
      PORT: "3001",
      SECRET_KEY: "test-secret",
      JWT_SECRET: "test-secret",
    },
  },
});
