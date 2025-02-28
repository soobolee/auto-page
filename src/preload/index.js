import {ipcRenderer, contextBridge} from "electron";

try {
  contextBridge.exposeInMainWorld("electronAPI", {
    getMacroItemList: () => ipcRenderer.invoke("get-macro-item-list"),
    getMacroItem: (contentType, fileName) => ipcRenderer.invoke("get-macro-item", contentType, fileName),
    capturePage: (webviewSize) => ipcRenderer.invoke("capture-page", webviewSize),
    saveMacro: (fileName, fileContent, contentType) => ipcRenderer.invoke("save-macro", fileName, fileContent, contentType),
    saveImage: (fileName, fileContent) => ipcRenderer.invoke("save-image", fileName, fileContent),
    deleteMacroAndImage: (fileName, imageDeleteOption) => ipcRenderer.invoke("delete-macro-and-image", fileName, imageDeleteOption),
  });

  const getClassInfo = (eventTargetClassList, eventTarget) => {
    if (eventTargetClassList.length) {
      return eventTargetClassList.map((className) => {
        const duplicatedClassList = Array.from(document.getElementsByClassName(className));

        return {
          className: className,
          classIndex: duplicatedClassList.indexOf(eventTarget),
        };
      });
    }
  };

  const sleep = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  let endOfInput = false;

  const waitEndOfIpc = async (eventChannel) => {
    ipcRenderer.sendToHost(eventChannel);

    while (!endOfInput) {
      await sleep(10);
    }

    endOfInput = false;
  };

  ipcRenderer.on("end-input", () => {
    endOfInput = true;
  });

  ipcRenderer.on("client-event", (_, macroStageList) => {
    if (macroStageList) {
      ipcRenderer.sendToHost("client-event", macroStageList);
    }
  });

  ipcRenderer.on("auto-macro", async (_, macroStageList) => {
    executeMacro(macroStageList);
  });

  const waitForGetElement = async (selector, classIndex = 0, stageInfo, restStageList) => {
    let targetElement = null;

    if (location.href !== stageInfo.url && stageInfo.tageName !== "A") {
      if (restStageList.length === 0) {
        ipcRenderer.sendToHost("macro-end");
      }

      ipcRenderer.sendToHost("macro-stop", restStageList);
      location.href = stageInfo.url;
      return;
    }

    if (document.querySelectorAll(selector)[classIndex]) {
      targetElement = document.querySelectorAll(selector)[classIndex];
    }

    if (targetElement) {
      return targetElement;
    }

    const observer = new MutationObserver(() => {
      targetElement = document.querySelectorAll(selector)[classIndex];
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

    while (!targetElement && Date.now() - start < 1500) {
      targetElement = document.querySelectorAll(selector)[classIndex];
      await sleep(100);
    }

    observer.disconnect();

    return targetElement || null;
  };

  const executeMacro = async (macroStageList) => {
    const restStageList = [...macroStageList];
    let beforeTarget = null;
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
        if (stageInfo.href && location.href !== stageInfo.href && stageInfo.tagName === "A") {
          beforeTarget = restStageList.shift();

          if (restStageList.length === 0) {
            ipcRenderer.sendToHost("macro-end");
          }

          macroBreak = true;
          ipcRenderer.sendToHost("macro-stop", restStageList);
          location.href = stageInfo.href;
          return;
        }

        const targetElementList = [];

        if (stageInfo.id) {
          const targetElement = await waitForGetElement(`#${stageInfo.id}`, null, stageInfo, restStageList);
          if (targetElement) {
            targetElementList.push(targetElement);
          }
        }

        if (stageInfo.class) {
          const classList = stageInfo.class;

          for (const classInfo of classList) {
            const targetElement = await waitForGetElement(`.${classInfo.className}`, classInfo.classIndex, stageInfo, restStageList);
            if (targetElement) {
              targetElementList.push(targetElement);
            }
          }
        }

        if (stageInfo.tagName) {
          const targetElement = await waitForGetElement(stageInfo.tagName, stageInfo.tagIndex, stageInfo, restStageList);
          if (targetElement) {
            targetElementList.push(targetElement);
          }
        }

        if (!targetElementList.length) {
          if (beforeTarget.method === "KEYDOWN") {
            break;
          }

          ipcRenderer.sendToHost("macro-end");
          alert("이벤트 타겟요소를 찾을 수 없습니다. 잠시 후 재시도 해주세요.");
          break;
        }

        const executeEvent = async () => {
          beforeTarget = restStageList.shift();

          if (stageInfo.method === "CLICK") {
            targetElementList[currentTargetIndex].focus();
            targetElementList[currentTargetIndex].click();
          }

          if (stageInfo.method === "CHANGE" || stageInfo.method === "KEYDOWN") {
            targetElementList[currentTargetIndex].focus();
            targetElementList[currentTargetIndex].value = stageInfo.value;
            await waitEndOfIpc("input-paste");

            if (stageInfo.method === "KEYDOWN") {
              targetElementList[currentTargetIndex].focus();
              await waitEndOfIpc("input-enter");
            }
          }
        };

        try {
          await executeEvent();
        } catch {
          currentTargetIndex += 1;
          restStageList.unshift(beforeTarget);

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
      Array.from(iframe).forEach((frame) => {
        frame.remove();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener(
      "click",
      (event) => {
        if (event.isTrusted) {
          const eventTargetUrl = location.href;
          const aTag = event.target.closest("a");
          const buttonTag = event.target.closest("button");
          const iButtonTag = event.target.closest("input[type='button']");

          const eventTarget = aTag || buttonTag || iButtonTag;

          if (!eventTarget) {
            return;
          }

          const currentTimestamp = Date.now();
          if (currentTimestamp - lastEventTimestamp < 500) {
            return;
          }

          lastEventTimestamp = currentTimestamp;

          const eventTargetId = eventTarget.id;
          const eventTagIndex = Array.from(document.querySelectorAll(eventTarget.tagName)).indexOf(eventTarget);
          const eventTargetClassList = Array.from(eventTarget.classList);
          const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

          if (aTag) {
            if (aTag.target === "_blank") {
              ipcRenderer.sendToHost("new-tab", aTag.href);
            }

            ipcRenderer.send("event-occurred", {
              id: eventTargetId,
              tagName: eventTarget.tagName,
              tagIndex: eventTagIndex,
              class: eventTargetClassInfo,
              href: aTag.href,
              url: eventTargetUrl,
              method: "CLICK",
            });
          }

          if (buttonTag) {
            ipcRenderer.send("event-occurred", {
              id: eventTargetId,
              tagName: eventTarget.tagName,
              tagIndex: eventTagIndex,
              class: eventTargetClassInfo,
              url: eventTargetUrl,
              method: "CLICK",
            });
          }

          if (iButtonTag) {
            ipcRenderer.send("event-occurred", {
              id: eventTargetId,
              tagName: eventTarget.tagName,
              tagIndex: eventTagIndex,
              class: eventTargetClassInfo,
              url: eventTargetUrl,
              method: "CLICK",
            });
          }
        }
      },
      {capture: true}
    );

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Enter") {
          return;
        }

        const currentTimestamp = Date.now();
        if (currentTimestamp - lastEventTimestamp < 500) {
          return;
        }

        lastEventTimestamp = currentTimestamp;
        const eventTarget = event.target;
        const eventTargetUrl = location.href;
        const eventTagIndex = Array.from(document.querySelectorAll(eventTarget.tagName)).indexOf(eventTarget);
        const eventTargetClassList = Array.from(eventTarget.classList);
        const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

        ipcRenderer.send("event-occurred", {
          id: eventTarget.id,
          tagName: eventTarget.tagName,
          tagIndex: eventTagIndex,
          class: eventTargetClassInfo,
          url: eventTargetUrl,
          method: "KEYDOWN",
          value: eventTarget.value,
        });
      },
      {capture: true}
    );

    document.addEventListener(
      "change",
      (event) => {
        const eventTarget = event.target;
        const eventTargetUrl = location.href;
        const eventTagIndex = Array.from(document.querySelectorAll(eventTarget.tagName)).indexOf(eventTarget);
        const eventTargetClassList = Array.from(eventTarget.classList);
        const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

        ipcRenderer.send("event-occurred", {
          id: eventTarget.id,
          tagName: eventTarget.tagName,
          tagIndex: eventTagIndex,
          class: eventTargetClassInfo,
          url: eventTargetUrl,
          method: "CHANGE",
          value: eventTarget.value,
        });
      },
      {capture: true}
    );
  });
} catch (error) {
  console.error(error);
}
