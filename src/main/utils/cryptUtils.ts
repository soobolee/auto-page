import crypto from "crypto";

const algorithm = "aes-256-cbc";

export function inputValueEncrypt(
  text: string,
  key: Buffer<ArrayBufferLike> | string,
  iv: Buffer<ArrayBufferLike> | string
): string {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function inputValueDecrypt(
  encryptText: string,
  key: Buffer<ArrayBufferLike> | string,
  iv: Buffer<ArrayBufferLike> | string
): string {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
