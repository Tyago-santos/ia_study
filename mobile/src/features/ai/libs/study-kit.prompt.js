"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STUDY_KIT_SYSTEM_PROMPT = void 0;
exports.buildStudyKitPrompt = buildStudyKitPrompt;
const study_kit_schema_1 = require("@/features/ai/schemas/study-kit.schema");
/**
 * O texto que pede o material de estudo.
 *
 * Mora aqui, longe do servico, porque e' o pedaco que mais muda com o produto e
 * o unico que da' para conferir sozinho — sem banco, sem rede.
 */
exports.STUDY_KIT_SYSTEM_PROMPT = `Você é um professor que prepara material de estudo em português do Brasil.

Regras:
- Escreva para quem está estudando o assunto agora: linguagem clara, sem enrolação.
- Cubra os assuntos informados. Se não houver assuntos listados, cubra os fundamentos da matéria.
- Priorize os assuntos marcados como pendentes: é neles que a pessoa precisa de ajuda.
- Flashcards: uma pergunta objetiva na frente, resposta curta no verso. Nada de "o que é X?" repetido.
- Mapa mental: ramos são os grandes blocos do conteúdo; sub-ramos são conceitos concretos, não frases.
- Quiz: alternativas plausíveis entre si. Nada de alternativa obviamente absurda, e só uma correta.
- Não invente dados sobre a pessoa. Você só recebeu o nome da matéria e a lista de assuntos.`;
/** Monta o pedido com o contexto da materia escolhida na Biblioteca. */
function buildStudyKitPrompt({ subjectName, topics }) {
    const pending = topics.filter((topic) => !topic.completed).map((topic) => topic.name);
    const done = topics.filter((topic) => topic.completed).map((topic) => topic.name);
    const lines = [`Matéria: ${subjectName}`];
    if (pending.length > 0)
        lines.push(`Assuntos pendentes (prioridade): ${pending.join(', ')}`);
    if (done.length > 0)
        lines.push(`Assuntos já concluídos (revisão): ${done.join(', ')}`);
    if (topics.length === 0) {
        lines.push('Nenhum assunto cadastrado — cubra os fundamentos da matéria.');
    }
    lines.push('', 'Monte o material completo: um resumo, ' +
        `${study_kit_schema_1.KIT_SIZES.flashcards.min} a ${study_kit_schema_1.KIT_SIZES.flashcards.max} flashcards, ` +
        'um mapa mental e um quiz de múltipla escolha.');
    return lines.join('\n');
}
