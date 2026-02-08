import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * 获取加密密钥（32 字节），从环境变量 API_KEY_ENCRYPTION_SECRET 读取
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("API_KEY_ENCRYPTION_SECRET 必须至少 32 个字符");
  }
  // 取前 32 字节作为 AES-256 密钥
  return Buffer.from(secret.slice(0, 32), "utf-8");
}

/**
 * AES-256-GCM 加密
 * 返回格式: iv(hex):tag(hex):ciphertext(hex)
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

/**
 * AES-256-GCM 解密
 */
export function decrypt(encrypted: string): string {
  const key = getEncryptionKey();
  const [ivHex, tagHex, ciphertext] = encrypted.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertext, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}
