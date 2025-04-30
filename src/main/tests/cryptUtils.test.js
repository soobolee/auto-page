import crypto from "crypto";
import {describe, expect, test} from "vitest";

import {inputValueDecrypt, inputValueEncrypt} from "../utils/cryptUtils";

const testText = "test를 위한 문자열 입니다.";

describe("inputValueEncrypt", () => {
  test("평문은 암호화 됩니다.", () => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const encryptedText = inputValueEncrypt(testText, key, iv);
    expect(testText === encryptedText).toBeFalsy();
  });
});

describe("inputValueDecrypt", () => {
  test("암호문은 복호화 시 다시 평문으로 돌아와야 합니다.", () => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const encryptedText = inputValueEncrypt(testText, key, iv);
    const decryptedText = inputValueDecrypt(encryptedText, key, iv);
    expect(testText === decryptedText).toBeTruthy();
  });
});

describe("wrong key inputValueDecrypt", () => {
  test("복호화 시 잘못된 key를 사용하면 undefined가 반환되야 합니다.", () => {
    const key = crypto.randomBytes(32);
    const wrongKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const encryptedText = inputValueEncrypt(testText, key, iv);
    expect(inputValueDecrypt(encryptedText, wrongKey, iv)).toBeFalsy();
  });
});

describe("wrong iv inputValueDecrypt", () => {
  test("복호화 시 잘못된 iv를 사용하면 다른 값으로 복호화되야 합니다.", () => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const wrongIv = crypto.randomBytes(16);
    const encryptedText = inputValueEncrypt(testText, key, iv);
    const decryptedText = inputValueDecrypt(encryptedText, key, wrongIv);
    expect(testText === decryptedText).toBeFalsy();
  });
});
