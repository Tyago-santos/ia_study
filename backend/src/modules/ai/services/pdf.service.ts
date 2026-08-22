import { PDFParse } from "pdf-parse";

import { AppError } from "@/shared/error/app-error.js";

/**
 * Extrai o texto de um PDF no servidor, em vez de mandar o arquivo binario
 * inteiro pro Gemini processar como documento multimodal: texto puro e' bem
 * mais rapido e barato de processar do que o PDF (paginas, fontes, imagens).
 */
export async function extractPdfText(base64: string): Promise<string> {
  const buffer = Buffer.from(base64, "base64");

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    // `result.text` intercala separadores "-- x of y --" entre paginas; junta
    // so' o texto de cada uma, que e' o que interessa pro modelo ler.
    const text = result.pages
      .map((page) => page.text.trim())
      .filter(Boolean)
      .join("\n\n");

    if (!text) {
      throw new AppError("Não foi possível extrair texto deste PDF (pode ser um PDF escaneado/imagem).", 422);
    }

    return text;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("[pdf]", error);
    throw new AppError("Não foi possível ler este PDF.", 422);
  } finally {
    await parser.destroy();
  }
}
