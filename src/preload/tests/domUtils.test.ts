import {beforeEach, describe, expect, test} from "vitest";

import {createTargetAlertCircle, getClassInfo} from "../utils/domUtils";

describe("createTargetAlertCircle", () => {
  test("alertCircle은 의도한 모양대로 만들어져야 합니다.", () => {
    const el = createTargetAlertCircle();

    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.id).toBe("targetAlertCircle");
    expect(el.style.position).toBe("absolute");
    expect(el.style.width).toBe("20px");
    expect(el.style.height).toBe("20px");
    expect(el.style.borderRadius).toBe("100%");
    expect(el.style.zIndex).toBe("99999");
    expect(el.style.display).toBe("none");
  });
});

describe("getClassInfo", () => {
  let target: HTMLDivElement | null = null;

  beforeEach(() => {
    target = document.createElement("div");
    target.classList.add("test-class");
    document.body.innerHTML = "";
    document.body.appendChild(target);
  });

  test("target요소에 대해 클래스 정보[className, classIndex]를 반환해야 합니다. ", () => {
    if (target) {
      const classList = Array.from(target.classList);
      const classInfo = getClassInfo(classList, target);
      expect(classInfo).toEqual([{className: "test-class", classIndex: 0}]);
    } else {
      expect.fail("target을 찾지 못했습니다.");
    }
  });

  test("target요소에 대한 클래스 정보가 없다면 falsy값을 반환해야 합니다.", () => {
    if (target) {
      const classInfo = getClassInfo([], target);
      expect(classInfo).toBeFalsy();
    } else {
      expect.fail("target을 찾지 못했습니다.");
    }
  });
});
