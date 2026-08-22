import type { Request, Response } from "express";

import * as gemini from "../services/gemini.service.js";
import { extractPdfText } from "../services/pdf.service.js";
import {
  extractPdfSchema,
  generateJsonSchema,
  generateSchema,
  transcribeSchema,
} from "../schema/ai.schema.js";

/**
 * Aborta a chamada ao Gemini se o cliente desistir e fechar a conexão antes
 * da resposta sair — `req.on('close')` dispararia cedo demais (o corpo da
 * requisição já chegou inteiro bem antes da resposta), por isso é o `res`.
 */
function abortOnClose(res: Response): AbortSignal {
  const controller = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) controller.abort();
  });
  return controller.signal;
}

export class AiController {
  /** O app usa isto pra avisar antes de deixar o usuario perguntar, em vez de so' falhar na hora. */
  async status(_req: Request, res: Response) {
    return res.status(200).json({ configured: gemini.isConfigured() });
  }

  async generate(req: Request, res: Response) {
    const validBody = generateSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const parts = await gemini.generateContent({
      contents: validBody.data.contents,
      systemInstruction: validBody.data.systemInstruction,
      tools: validBody.data.tools,
      useWebSearch: validBody.data.useWebSearch,
      signal: abortOnClose(res),
    });

    return res.status(200).json({ parts });
  }

  async generateJson(req: Request, res: Response) {
    const validBody = generateJsonSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const data = await gemini.generateJson(validBody.data);

    return res.status(200).json({ data });
  }

  async transcribe(req: Request, res: Response) {
    const validBody = transcribeSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const text = await gemini.transcribeAudio(validBody.data);

    return res.status(200).json({ text });
  }

  async extractPdf(req: Request, res: Response) {
    const validBody = extractPdfSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const text = await extractPdfText(validBody.data.base64);

    return res.status(200).json({ text });
  }
}
