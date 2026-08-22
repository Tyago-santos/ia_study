"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STUDY_KIT_RESPONSE_SCHEMA = exports.studyKitSchema = exports.KIT_SIZES = void 0;
const zod_1 = require("zod");
/**
 * O material de estudo que a IA gera de uma vez: resumo, flashcards, mapa
 * mental e quiz.
 *
 * A forma aparece duas vezes de proposito, porque sao contratos diferentes:
 * `STUDY_KIT_RESPONSE_SCHEMA` e o formato EXIGIDO do modelo (o Gemini so'
 * consegue emitir tokens que caibam nele) e `studyKitSchema` e a CONFERENCIA do
 * que chegou. O primeiro garante a forma; o segundo protege o banco local de um
 * retorno estranho antes de virar registro gravado.
 *
 * Os campos estao em portugues porque e' o texto que o modelo escreve — pedir
 * "frente"/"verso" rende conteudo melhor do que "front"/"back" num pedido feito
 * em portugues. A traducao para os tipos do app acontece ao gravar.
 */
/** Quantidades pedidas ao modelo. Mexer aqui muda os dois contratos juntos. */
exports.KIT_SIZES = {
    flashcards: { min: 6, max: 10 },
    branches: { min: 3, max: 5 },
    leaves: { min: 2, max: 4 },
    questions: { min: 4, max: 6 },
    options: 4,
};
exports.studyKitSchema = zod_1.z.object({
    resumo: zod_1.z.object({
        titulo: zod_1.z.string().min(1),
        conteudo: zod_1.z.string().min(1),
    }),
    flashcards: zod_1.z
        .array(zod_1.z.object({
        frente: zod_1.z.string().min(1),
        verso: zod_1.z.string().min(1),
        dificuldade: zod_1.z.enum(['easy', 'medium', 'hard']),
    }))
        .min(1),
    mapaMental: zod_1.z.object({
        titulo: zod_1.z.string().min(1),
        ramos: zod_1.z
            .array(zod_1.z.object({
            rotulo: zod_1.z.string().min(1),
            subRamos: zod_1.z.array(zod_1.z.string().min(1)),
        }))
            .min(1),
    }),
    quiz: zod_1.z.object({
        titulo: zod_1.z.string().min(1),
        questoes: zod_1.z
            .array(zod_1.z.object({
            pergunta: zod_1.z.string().min(1),
            // Duas alternativas ja formam uma questao respondivel: exigir as
            // quatro aqui jogaria fora o kit inteiro por uma questao mal formada.
            alternativas: zod_1.z.array(zod_1.z.string().min(1)).min(2),
            indiceCorreto: zod_1.z.number().int().nonnegative(),
        }))
            .min(1),
    }),
});
/** Formato exigido do Gemini, no subconjunto de OpenAPI que ele aceita. */
exports.STUDY_KIT_RESPONSE_SCHEMA = {
    type: 'OBJECT',
    properties: {
        resumo: {
            type: 'OBJECT',
            properties: {
                titulo: { type: 'STRING', description: 'Titulo curto do resumo.' },
                conteudo: {
                    type: 'STRING',
                    description: 'Resumo em markdown: abertura de um paragrafo, secoes com "## " e listas com "- ". Entre 250 e 500 palavras.',
                },
            },
            required: ['titulo', 'conteudo'],
        },
        flashcards: {
            type: 'ARRAY',
            minItems: exports.KIT_SIZES.flashcards.min,
            maxItems: exports.KIT_SIZES.flashcards.max,
            items: {
                type: 'OBJECT',
                properties: {
                    frente: { type: 'STRING', description: 'A pergunta do cartao.' },
                    verso: { type: 'STRING', description: 'A resposta, em ate duas frases.' },
                    dificuldade: { type: 'STRING', enum: ['easy', 'medium', 'hard'] },
                },
                required: ['frente', 'verso', 'dificuldade'],
            },
        },
        mapaMental: {
            type: 'OBJECT',
            properties: {
                titulo: { type: 'STRING', description: 'O no raiz do mapa.' },
                ramos: {
                    type: 'ARRAY',
                    minItems: exports.KIT_SIZES.branches.min,
                    maxItems: exports.KIT_SIZES.branches.max,
                    items: {
                        type: 'OBJECT',
                        properties: {
                            rotulo: { type: 'STRING', description: 'Nome do ramo, em ate 4 palavras.' },
                            subRamos: {
                                type: 'ARRAY',
                                minItems: exports.KIT_SIZES.leaves.min,
                                maxItems: exports.KIT_SIZES.leaves.max,
                                items: { type: 'STRING' },
                            },
                        },
                        required: ['rotulo', 'subRamos'],
                    },
                },
            },
            required: ['titulo', 'ramos'],
        },
        quiz: {
            type: 'OBJECT',
            properties: {
                titulo: { type: 'STRING' },
                questoes: {
                    type: 'ARRAY',
                    minItems: exports.KIT_SIZES.questions.min,
                    maxItems: exports.KIT_SIZES.questions.max,
                    items: {
                        type: 'OBJECT',
                        properties: {
                            pergunta: { type: 'STRING' },
                            alternativas: {
                                type: 'ARRAY',
                                minItems: exports.KIT_SIZES.options,
                                maxItems: exports.KIT_SIZES.options,
                                items: { type: 'STRING' },
                            },
                            indiceCorreto: {
                                type: 'INTEGER',
                                description: 'Posicao da alternativa correta, começando em 0.',
                            },
                        },
                        required: ['pergunta', 'alternativas', 'indiceCorreto'],
                    },
                },
            },
            required: ['titulo', 'questoes'],
        },
    },
    required: ['resumo', 'flashcards', 'mapaMental', 'quiz'],
};
