"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiResponseSchema = exports.responsePartSchema = exports.functionCallPartSchema = exports.textPartSchema = exports.agentRequestSchema = exports.MAX_HISTORY_TURNS = exports.chatTurnSchema = void 0;
const zod_1 = require("zod");
/**
 * Schemas da feature de IA.
 *
 * A resposta do Gemini e' validada aqui, na fronteira: se o formato do provedor
 * mudar, quebra num ponto so' e nao dentro de um componente de tela.
 */
/** Um turno do historico. So' o texto importa para o contexto do modelo. */
exports.chatTurnSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'assistant']),
    content: zod_1.z.string(),
});
/** Quantos turnos anteriores viajam junto com a pergunta. */
exports.MAX_HISTORY_TURNS = 20;
/** Entrada de uma rodada do agente. */
exports.agentRequestSchema = zod_1.z.object({
    message: zod_1.z.string().trim().min(1, 'Mensagem vazia.'),
    history: zod_1.z.array(exports.chatTurnSchema).max(exports.MAX_HISTORY_TURNS).default([]),
});
/**
 * Bloco de texto devolvido pelo modelo.
 *
 * O `passthrough` preserva campos que o provedor acrescente (o Gemini 2.5 anexa
 * a assinatura do raciocinio a parte): as partes do modelo sao reenviadas na
 * rodada seguinte e chegariam mutiladas se o zod as descartasse.
 */
exports.textPartSchema = zod_1.z.object({ text: zod_1.z.string() }).passthrough();
/** Pedido do modelo para rodar uma ferramenta. */
exports.functionCallPartSchema = zod_1.z
    .object({
    functionCall: zod_1.z.object({
        name: zod_1.z.string(),
        args: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
})
    .passthrough();
/** Uma parte da resposta. Tipos ainda desconhecidos caem no objeto aberto. */
exports.responsePartSchema = zod_1.z.union([
    exports.textPartSchema,
    exports.functionCallPartSchema,
    zod_1.z.object({}).passthrough(),
]);
/** Corpo devolvido por `models/{model}:generateContent`. */
exports.geminiResponseSchema = zod_1.z.object({
    candidates: zod_1.z
        .array(zod_1.z.object({
        content: zod_1.z.object({ parts: zod_1.z.array(exports.responsePartSchema).default([]) }).optional(),
        finishReason: zod_1.z.string().optional(),
    }))
        .default([]),
    promptFeedback: zod_1.z.object({ blockReason: zod_1.z.string().optional() }).optional(),
});
