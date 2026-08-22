import * as DocumentPicker from 'expo-document-picker'
import { File } from 'expo-file-system'
import { extractPdfText } from '@/features/ai/libs/gemini/gemini.client'
import { referenceFilesService } from '@/shared/services/dataStore'
import type { ReferenceFile } from '@/shared/types'

/**
 * Importa arquivos de referencia para o agente consultar (tool
 * `read_reference_file` em `agent-tools.service.ts`).
 *
 * Imagem vai para o Gemini como anexo de verdade (base64 na chamada). PDF tem
 * o texto extraido no backend no momento da importacao (ver `extractPdfText`)
 * e passa a se comportar como .txt/.md dali em diante — mais rapido/barato
 * pro modelo processar do que o documento binario inteiro a cada pergunta.
 * Texto e markdown sao lidos direto e guardados como string.
 */

type MimeType = ReferenceFile['mimeType']

const TEXT_MIME_TYPES: MimeType[] = ['text/plain', 'text/markdown']
const IMAGE_MIME_TYPES: MimeType[] = ['image/jpeg', 'image/png', 'image/webp']
const PDF_MIME_TYPE: MimeType = 'application/pdf'
const KNOWN_MIME_TYPES: MimeType[] = [...TEXT_MIME_TYPES, PDF_MIME_TYPE, ...IMAGE_MIME_TYPES]

/** So' a imagem vai anexada como binario na chamada ao Gemini; PDF vira texto extraido. */
function isAttachmentType(mimeType: MimeType): boolean {
  return (IMAGE_MIME_TYPES as string[]).includes(mimeType)
}

/** Base64 e ~33% maior que o arquivo; fica folgado do teto de requisicao
 * inline do Gemini (20MB) somado ao resto da conversa. */
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024
/** PDF e' extraido no backend antes de virar texto: pode ser bem maior que o
 * teto de anexo, o resultado extraido e' que fica pequeno. */
const MAX_PDF_SOURCE_BYTES = 20 * 1024 * 1024
/** Texto entra inteiro no prompt a cada chamada da rodada de tools: mantido
 * pequeno para nao inflar o custo/latencia de cada pergunta que o usa. */
const MAX_TEXT_BYTES = 1 * 1024 * 1024
/** Teto do texto extraido de um PDF — trunca em vez de falhar, o documento existe. */
const MAX_EXTRACTED_TEXT_CHARS = 4 * 1024 * 1024

export class ReferenceFileError extends Error {}

/** Alguns Android devolvem mimeType generico; a extensao desempata. */
function resolveMimeType(name: string, mimeType: string | null | undefined): MimeType | null {
  if (mimeType && (KNOWN_MIME_TYPES as string[]).includes(mimeType)) return mimeType as MimeType

  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return PDF_MIME_TYPE
  if (ext === 'md' || ext === 'markdown') return 'text/markdown'
  if (ext === 'txt') return 'text/plain'
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return null
}

/**
 * Abre o seletor de arquivos do aparelho e cadastra o escolhido.
 * Devolve `null` quando o usuario cancela a selecao, sem erro.
 */
export async function pickReferenceFile(): Promise<ReferenceFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: KNOWN_MIME_TYPES,
    copyToCacheDirectory: true,
  })
  if (result.canceled) return null

  const picked = result.assets[0]
  const mimeType = resolveMimeType(picked.name, picked.mimeType)
  if (!mimeType) {
    throw new ReferenceFileError('Formato não suportado. Envie um PDF, imagem, .txt ou .md.')
  }

  const file = new File(picked.uri)
  const sizeBytes = file.size ?? picked.size ?? 0

  if (isAttachmentType(mimeType) && sizeBytes > MAX_ATTACHMENT_BYTES) {
    throw new ReferenceFileError('Arquivo muito grande (máximo 8 MB).')
  }
  if (mimeType === PDF_MIME_TYPE && sizeBytes > MAX_PDF_SOURCE_BYTES) {
    throw new ReferenceFileError('Arquivo muito grande (máximo 20 MB).')
  }
  if (!isAttachmentType(mimeType) && mimeType !== PDF_MIME_TYPE && sizeBytes > MAX_TEXT_BYTES) {
    throw new ReferenceFileError('Arquivo de texto muito grande (máximo 1 MB).')
  }

  if (isAttachmentType(mimeType)) {
    const base64 = await file.base64()
    return referenceFilesService.create({ name: picked.name, mimeType, sizeBytes, base64 })
  }

  if (mimeType === PDF_MIME_TYPE) {
    const base64 = await file.base64()
    let text: string
    try {
      text = await extractPdfText({ base64 })
    } catch {
      throw new ReferenceFileError('Não foi possível ler o texto deste PDF. Ele pode ser escaneado (imagem).')
    }
    if (text.length > MAX_EXTRACTED_TEXT_CHARS) {
      text = `${text.slice(0, MAX_EXTRACTED_TEXT_CHARS)}\n\n[...texto truncado, o PDF é muito extenso]`
    }
    return referenceFilesService.create({ name: picked.name, mimeType, sizeBytes, text })
  }

  const text = await file.text()
  return referenceFilesService.create({ name: picked.name, mimeType, sizeBytes, text })
}
