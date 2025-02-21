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

  ipcRenderer.on("client-event", (_, macroStageList) => {
    if (macroStageList) {
      ipcRenderer.sendToHost("client-event", macroStageList);
    }
  });

  function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  function waitForGetElement(selector, classIndex = 0) {
    return new Promise((resolve) => {
      if (document.querySelectorAll(selector)[classIndex]) {
        return resolve(document.querySelectorAll(selector)[classIndex]);
      }

      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(selector)[classIndex]) {
          observer.disconnect();
          return resolve(document.querySelectorAll(selector)[classIndex]);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      sleep(1500).then(() => {
        observer.disconnect();
        if (document.querySelectorAll(selector)[classIndex]) {
          return resolve(document.querySelectorAll(selector)[classIndex]);
        }

        return resolve(null);
      });
    });
  }

  const executeMacro = async (macroStageList) => {
    const restStageList = [...macroStageList];
    let beforeTarget = [];
    let macroBreak = false;

    window.addEventListener("beforeunload", () => {
      macroBreak = true;
      ipcRenderer.sendToHost("macro-stop", restStageList);
    });

    for (const stageInfo of macroStageList) {
      await sleep(100);
      if (!macroBreak) {
        if (stageInfo.href && location.href !== stageInfo.href) {
          beforeTarget = restStageList.shift();

          if (restStageList.length === 0) {
            ipcRenderer.sendToHost("macro-end");
          }

          location.href = stageInfo.href;
          return;
        }

        let targetElement = null;

        if (stageInfo.id) {
          targetElement = await waitForGetElement(`#${stageInfo.id}`);
        }

        if (!targetElement && stageInfo.class) {
          const classList = stageInfo.class;

          for (const classInfo of classList) {
            targetElement = await waitForGetElement(`.${classInfo.className}`, classInfo.classIndex);
            if (targetElement) {
              break;
            }
          }
        }

        if (!targetElement) {
          if (beforeTarget.method === "KEYDOWN") {
            break;
          }
          alert("이벤트 타겟요소를 찾을 수 없습니다.");
          ipcRenderer.sendToHost("macro-end");
          break;
        }

        if (stageInfo.method === "CLICK") {
          targetElement.focus();
          targetElement.click();
          beforeTarget = restStageList.shift();
        }

        if (stageInfo.method === "CHANGE" || stageInfo.method === "KEYDOWN") {
          targetElement.click();
          targetElement.focus();
          targetElement.value = stageInfo.value;
          ipcRenderer.sendToHost("input-paste");

          if (stageInfo.method === "KEYDOWN") {
            targetElement.click();
            targetElement.focus();
            ipcRenderer.sendToHost("input-enter");
          }
          beforeTarget = restStageList.shift();
        }

        if (restStageList.length === 0) {
          ipcRenderer.sendToHost("macro-end");
        }
      }
    }
  };

  ipcRenderer.on("auto-macro", async (_, macroStageList) => {
    executeMacro(macroStageList);
  });

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

          const eventTargetId = eventTarget.id;
          const eventTargetClassList = Array.from(eventTarget.classList);
          const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

          if (aTag) {
            if (aTag.target === "_blank") {
              ipcRenderer.sendToHost("new-tab", aTag.href);
            }

            ipcRenderer.send("event-occurred", {
              id: eventTargetId,
              tagName: eventTarget.tagName,
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
              class: eventTargetClassInfo,
              url: eventTargetUrl,
              method: "CLICK",
            });
          }

          if (iButtonTag) {
            ipcRenderer.send("event-occurred", {
              id: eventTargetId,
              tagName: eventTarget.tagName,
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
        const eventTarget = event.target;
        const eventTargetUrl = location.href;
        const eventTargetClassList = Array.from(eventTarget.classList);
        const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

        ipcRenderer.send("event-occurred", {
          id: eventTarget.id,
          tagName: eventTarget.tagName,
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
        const eventTargetClassList = Array.from(eventTarget.classList);
        const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

        ipcRenderer.send("event-occurred", {
          id: eventTarget.id,
          tagName: eventTarget.tagName,
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
