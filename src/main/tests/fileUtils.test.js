import {describe, expect, test, vi} from "vitest";

import {deleteFile, getMacroItem, getMacroItemList, writeMacroInfoFile} from "../utils/fileUtils";

vi.mock("electron", () => ({
  app: {
    getPath: () => "auto-page/test/",
  },
}));

vi.mock("../cryptUtils", () => ({
  inputValueEncrypt: vi.fn((val) => `encrypt-${val}`),
  inputValueDecrypt: vi.fn((val) => `decrypt-${val}`),
}));

vi.mock("fs", () => {
  const fsMock = {
    readFileSync: vi.fn((path) => {
      if (path.includes("CRYPT_KEY")) {
        return "a".repeat(32);
      }
      if (path.includes("CRYPT_IV")) {
        return "b".repeat(16);
      }
      return JSON.stringify({stageList: [{id: 1, value: "encrypted"}]});
    }),
    statSync: vi.fn(() => ({
      birthtime: new Date(),
      atime: new Date(),
    })),
    mkdirSync: vi.fn(() => true),
    existsSync: vi.fn((path) => {
      if (path.includes("testFile")) {
        return true;
      } else {
        return false;
      }
    }),
    unlinkSync: vi.fn((path) => path.includes("testFile")),
    writeFileSync: vi.fn(() => true),
    readdirSync: vi.fn(() => ["testFile.json"]),
  };

  return {
    default: fsMock,
  };
});

describe("deleteFile", () => {
  test("제거할 파일의 경로가 잘 들어온 경우는 true를 반환해야 합니다.", () => {
    const result = deleteFile("testFile", false);
    expect(result).toBe(true);
  });
});

describe("getMacroItem", () => {
  test("가져올 파일의 경로가 잘 들어온 경우는 해당 파일 아이템을 반환해야 합니다.", () => {
    const item = getMacroItem("stageList", "testFile");
    expect(item).toBeDefined();
  });
});

describe("getMacroItemList", () => {
  test("폴더경로가 지정되어 있든 없든 이 함수의 반환값은 항상 배열이어야 합니다.", () => {
    const list = getMacroItemList("stageList");
    console.log(list);
    expect(Array.isArray(list)).toBe(true);
  });
});

describe("writeMacroInfoFile", () => {
  test("인수로 받는 배열을 전해받은 경로 파일에 삽입해야 합니다.", () => {
    const result = writeMacroInfoFile("testFile", [{id: 1, value: "test"}], "stageList");
    expect(result).toBe(true);
  });
});
