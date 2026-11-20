import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const MAGIC = "v1";
const IV_BYTES = 12;

/** Deriva uma chave de 32 bytes a partir do segredo configurado. */
function keyFromSecret(secret: string): Buffer {
  return createHash("sha256").update(secret, "utf8").digest();
}

/**
 * Cifra um valor com AES-256-GCM. O formato na coluna do banco é:
 * `v1.<iv b64url>.<tag b64url>.<ciphertext b64url>`
 */
export function encrypt(secret: string, plaintext: string): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", keyFromSecret(secret), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    MAGIC,
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

/** Decifra um valor produzido por `encrypt`. Lança se o payload foi adulterado. */
export function decrypt(secret: string, payload: string): string {
  const [magic, ivPart, tagPart, dataPart, ...extra] = payload.split(".");
  if (magic !== MAGIC || !ivPart || !tagPart || !dataPart || extra.length > 0) {
    throw new Error("Payload cifrado malformado");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    keyFromSecret(secret),
    Buffer.from(ivPart, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(dataPart, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
