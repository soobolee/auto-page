import {describe, expect, test} from "vitest";

import {addFrontZero, getCurrentTime, sleep} from "../utils/commonUtils";

describe("addFrontZero", () => {
  test("10 미만의 수가 들어오면 앞에 0을 붙여 반환해야 합니다.", () => {
    expect(addFrontZero(3)).toBe("03");
  });

  test("10 이상의 수가 들어오면 그대로 반환해야 합니다.", () => {
    expect(addFrontZero(10)).toBe(10);
  });
});

describe("getCurrentTime", () => {
  test("YYYYMMDDHHMMSS 형식으로 현재 시간을 반환해야 합니다.", () => {
    const result = getCurrentTime();
    expect(result).toMatch(/^\d{14}$/);
  });
});

describe("sleep", () => {
  test("주어진 시간 ms 만큼 스택을 대기해야 합니다.", async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});
