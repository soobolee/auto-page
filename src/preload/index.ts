import {contextBridge, ipcRenderer} from "electron";

import {sleep} from "../main/utils/commonUtils";
import {EventTargetInfo, MacroStage, WebviewSize} from "./types/preload";
import {createTargetAlertCircle, getClassInfo} from "./utils/domUtils";

try {
  contextBridge.exposeInMainWorld("electronAPI", {
    getMacroItemList: () => ipcRenderer.invoke("get-macro-item-list"),
    getMacroItem: (contentType: string, fileName: string) =>
      ipcRenderer.invoke("get-macro-item", contentType, fileName),
    capturePage: (webviewSize: WebviewSize) => ipcRenderer.invoke("capture-page", webviewSize),
    saveMacro: (fileName: string, fileContent: string, contentType: string) =>
      ipcRenderer.invoke("save-macro", fileName, fileContent, contentType),
    saveImage: (fileName: string, fileContent: string) => ipcRenderer.invoke("save-image", fileName, fileContent),
    deleteMacroAndImage: (fileName: string, imageDeleteOption: boolean) =>
      ipcRenderer.invoke("delete-macro-and-image", fileName, imageDeleteOption),
    changeSession: (isMacroExecuting: boolean) => ipcRenderer.send("did-execute-macro", isMacroExecuting),
  });

  const sendTargetElementInfo = (eventTarget: HTMLElement, method: string) => {
    const eventTargetUrl = location.href;
    const eventTagIndex = Array.from(document.querySelectorAll(eventTarget.tagName)).indexOf(eventTarget);
    const eventTargetClassList = Array.from(eventTarget.classList) as string[];
    const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

    ipcRenderer.send("event-occurred", {
      id: eventTarget.id,
      tagName: eventTarget.tagName,
      tagIndex: eventTagIndex,
      class: eventTargetClassInfo,
      url: eventTargetUrl,
      href: (eventTarget as HTMLAnchorElement).href,
      method: method,
      value: (eventTarget as HTMLInputElement).value,
    } as EventTargetInfo);
  };

  let endOfInput = false;

  const waitEndOfIpc = async (eventChannel: string) => {
    ipcRenderer.sendToHost(eventChannel);

    while (!endOfInput) {
      await sleep(10);
    }

    endOfInput = false;
  };

  ipcRenderer.on("end-input", () => {
    endOfInput = true;
  });

  ipcRenderer.on("client-event", (_, macroStageList: MacroStage[]) => {
    if (macroStageList) {
      ipcRenderer.sendToHost("client-event", macroStageList);
    }
  });

  ipcRenderer.on("auto-macro", async (_, macroStageList: MacroStage[]) => {
    executeMacro(macroStageList);
  });

  const waitForGetElement = async (
    selector: string,
    index: number = 0,
    stageInfo: MacroStage,
    restStageList: MacroStage[]
  ) => {
    try {
      let targetElement: Element | null = null;

      if (location.href !== stageInfo.url && stageInfo.tagName !== "A") {
        if (restStageList.length === 0) {
          ipcRenderer.sendToHost("macro-end");
        }

        ipcRenderer.sendToHost("macro-stop", restStageList);
        location.href = stageInfo.url || "";
        return;
      }

      if (document.querySelectorAll(selector)[index]) {
        targetElement = document.querySelectorAll(selector)[index];
      }

      if (targetElement) {
        return targetElement;
      }

      const observer = new MutationObserver(() => {
        targetElement = document.querySelectorAll(selector)[index];
        if (targetElement) {
          observer.disconnect();
          return targetElement;
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      const start = Date.now();

      while (!targetElement && Date.now() - start < 1000) {
        targetElement = document.querySelectorAll(selector)[index];
        await sleep(100);
      }

      observer.disconnect();

      return targetElement || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const executeMacro = async (macroStageList: MacroStage[]) => {
    const restStageList = [...macroStageList];
    let beforeTarget: MacroStage | null = null;
    let macroBreak = false;

    const unloadEvent = () => {
      window.removeEventListener("beforeunload", unloadEvent);
      macroBreak = true;
      ipcRenderer.sendToHost("macro-stop", restStageList);
    };

    window.addEventListener("beforeunload", unloadEvent);

    for (const stageInfo of macroStageList) {
      await sleep(500);
      let currentTargetIndex = 0;

      if (!macroBreak) {
        const targetElementList: Element[] = [];

        if (stageInfo.id) {
          const targetElement = await waitForGetElement(`#${stageInfo.id}`, 0, stageInfo, restStageList);
          if (targetElement) {
            targetElementList.push(targetElement);
          }
        }

        if (stageInfo.class) {
          const classList = stageInfo.class;

          for (const classInfo of classList) {
            const targetElement = await waitForGetElement(
              `.${classInfo.className}`,
              classInfo.classIndex,
              stageInfo,
              restStageList
            );
            if (targetElement) {
              targetElementList.push(targetElement);
            }
          }
        }

        if (stageInfo.tagName) {
          const targetElement = await waitForGetElement(
            stageInfo.tagName,
            stageInfo.tagIndex || 0,
            stageInfo,
            restStageList
          );
          if (targetElement) {
            targetElementList.push(targetElement);
          }
        }

        if (!targetElementList.length) {
          const shifted = restStageList.shift();
          if (shifted && shifted.method === "KEYDOWN") {
            break;
          }

          if (stageInfo.href && location.href !== stageInfo.href && stageInfo.tagName === "A") {
            beforeTarget = restStageList.shift() || null;

            if (restStageList.length === 0) {
              ipcRenderer.sendToHost("macro-end");
            }

            macroBreak = true;
            ipcRenderer.sendToHost("macro-stop", restStageList);
            location.href = stageInfo.href;
            return;
          }

          ipcRenderer.sendToHost("macro-end");
          alert("이벤트 타겟요소를 찾을 수 없습니다. 잠시 후 재시도 해주세요.");
          break;
        }

        const executeEvent = async () => {
          beforeTarget = restStageList.shift() || null;

          if (stageInfo.method === "CLICK") {
            (targetElementList[currentTargetIndex] as HTMLElement).focus();
            (targetElementList[currentTargetIndex] as HTMLElement).click();
          }

          if (stageInfo.method === "CHANGE" || stageInfo.method === "KEYDOWN") {
            (targetElementList[currentTargetIndex] as HTMLElement).focus();
            (targetElementList[currentTargetIndex] as HTMLInputElement).value = stageInfo.value || "";
            await waitEndOfIpc("input-paste");

            if (stageInfo.method === "KEYDOWN") {
              (targetElementList[currentTargetIndex] as HTMLElement).focus();
              await waitEndOfIpc("input-enter");
            }
          }
        };

        try {
          await executeEvent();
        } catch {
          currentTargetIndex += 1;
          if (beforeTarget) {
            restStageList.unshift(beforeTarget);
          }

          if (currentTargetIndex >= targetElementList.length) {
            ipcRenderer.sendToHost("macro-end");
            alert("이벤트 타겟요소를 찾을 수 없습니다. 잠시 후 재시도 해주세요.");
          }

          await executeEvent();
        }

        if (restStageList.length === 0) {
          ipcRenderer.sendToHost("macro-end");
        }
      }
    }
  };

  let lastEventTimestamp = 0;
  document.addEventListener("DOMContentLoaded", () => {
    if (document.title === "Auto Page") {
      return;
    }

    const observer = new MutationObserver(() => {
      const iframe = document.getElementsByTagName("iframe");

      if (iframe) {
        Array.from(iframe).forEach((frame) => {
          frame.remove();
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener(
      "click",
      (event: MouseEvent) => {
        if (event.isTrusted) {
          const target = event.target as HTMLElement;
          const aTag = target.closest("a");
          const buttonTag = target.closest("button");
          const iButtonTag = target.closest("input[type='button']");

          const eventTarget = aTag || buttonTag || iButtonTag;

          if (!eventTarget) {
            return;
          }

          const currentTimestamp = Date.now();
          if (currentTimestamp - lastEventTimestamp < 500) {
            return;
          }

          lastEventTimestamp = currentTimestamp;

          if (aTag) {
            if (aTag.target === "_blank") {
              ipcRenderer.sendToHost("new-tab", aTag.href);
            }
          }

          sendTargetElementInfo(eventTarget as HTMLElement, "CLICK");
        }
      },
      {capture: true}
    );

    document.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key !== "Enter") {
          return;
        }

        const currentTimestamp = Date.now();
        if (currentTimestamp - lastEventTimestamp < 500) {
          return;
        }

        lastEventTimestamp = currentTimestamp;
        sendTargetElementInfo(event.target as HTMLElement, "KEYDOWN");
      },
      {capture: true}
    );

    document.addEventListener(
      "change",
      (event: Event) => {
        sendTargetElementInfo(event.target as HTMLElement, "CHANGE");
      },
      {capture: true}
    );

    const targetAlertCircle = createTargetAlertCircle();
    const body = document.querySelector("body");
    if (body) {
      body.appendChild(targetAlertCircle);
    }

    document.addEventListener(
      "mousemove",
      (event: MouseEvent) => {
        const targetAlertCircle = document.querySelector("#targetAlertCircle") as HTMLElement;
        if (!targetAlertCircle) return;

        targetAlertCircle.style.display = "block";
        targetAlertCircle.style.top = `${event.clientY + window.scrollY}px`;
        targetAlertCircle.style.left = `${event.clientX + 20}px`;

        const target = event.target as HTMLElement;
        const aTag = target.closest("a");
        const buttonTag = target.closest("button");
        const iButtonTag = target.closest("input");
        const textTag = target.closest("textarea");

        const eventTarget = aTag || buttonTag || iButtonTag || textTag;

        if (!eventTarget) {
          targetAlertCircle.style.backgroundColor = "red";
          return;
        } else {
          targetAlertCircle.style.backgroundColor = "green";
        }
      },
      {capture: true}
    );
  });
} catch (error) {
  console.error(error);
}
