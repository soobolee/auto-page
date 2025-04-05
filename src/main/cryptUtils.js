import crypto from "crypto";

const algorithm = "aes-256-cbc";

export function inputValueEncrypt(text, key, iv) {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  } catch (error) {
    console.error(error);
  }
}

export function inputValueDecrypt(encryptText, key, iv) {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error(error);
  }
}
