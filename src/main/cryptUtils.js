import crypto from "crypto";
import {app} from "electron";
import fs from "fs";
import {join} from "path";

export function inputValueEncrypt(text) {
  const algorithm = "aes-256-cbc";
  const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
  const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

export function inputValueDecrypt(encryptText) {
  const algorithm = "aes-256-cbc";
  const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
  const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
