import {ipcRenderer, contextBridge} from "electron";

try {
  let macroBreak = false;

  contextBridge.exposeInMainWorld("electronAPI", {
    getMacroItem: () => ipcRenderer.invoke("get-macro-item"),
    saveMacro: (fileName, fileContent) => ipcRenderer.invoke("save-macro", fileName, fileContent),
    saveImage: (fileName, fileContent) => ipcRenderer.invoke("save-image", fileName, fileContent),
    capturePage: (webviewSize) => ipcRenderer.invoke("capture-page", webviewSize),
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

  ipcRenderer.on("get-macro-item", (_, macroItemList) => {
    if (macroItemList) {
      ipcRenderer.sendToHost("get-macro-item", macroItemList);
    }
  });

  async function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  function waitForGetElement(selector, classIndex = 0) {
    return new Promise((resolve) => {
      if (document.querySelectorAll(selector)[classIndex]) {
        return resolve(document.querySelectorAll(selector)[classIndex]);
      }

      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(selector)[classIndex]) {
          resolve(document.querySelectorAll(selector)[classIndex]);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  const executeMacro = async (macroStageList) => {
    const parseMacroStageList = JSON.parse(macroStageList);
    const restStageList = [...parseMacroStageList];

    window.addEventListener("beforeunload", () => {
      macroBreak = true;
      ipcRenderer.sendToHost("macro-stop", restStageList);
    });

    for (const stageInfo of parseMacroStageList) {
      await sleep(1000);

      if (!macroBreak) {
        if (stageInfo.href && location.href !== stageInfo.href) {
          restStageList.shift();
          location.href = stageInfo.href;
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

        if (stageInfo.method === "CLICK") {
          await targetElement.click();
          restStageList.shift();
        }

        if (stageInfo.method === "CHANGE" || stageInfo.method === "KEYDOWN") {
          restStageList.shift();
          targetElement.value = stageInfo.value;
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

    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === "IFRAME") {
              const replacementText = document.createElement("div");
              replacementText.innerHTML = "<div style='position:relative; top:50%; left:50%;'>iFrame은 등록 불가합니다.</div>";

              node.parentNode.replaceChild(replacementText, node);
            }
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const iframe = document.getElementsByTagName("iframe");
    Array.from(iframe).forEach((frame) => {
      frame.remove();
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

            ipcRenderer.send(
              "event-occurred",
              JSON.stringify({
                id: eventTargetId,
                tagName: eventTarget.tagName,
                class: eventTargetClassInfo,
                href: aTag.href,
                url: eventTargetUrl,
                method: "CLICK",
              })
            );
          }

          if (buttonTag) {
            ipcRenderer.send(
              "event-occurred",
              JSON.stringify({
                id: eventTargetId,
                tagName: eventTarget.tagName,
                class: eventTargetClassInfo,
                url: eventTargetUrl,
                method: "CLICK",
              })
            );
          }

          if (iButtonTag) {
            ipcRenderer.send(
              "event-occurred",
              JSON.stringify({
                id: eventTargetId,
                tagName: eventTarget.tagName,
                class: eventTargetClassInfo,
                url: eventTargetUrl,
                method: "CLICK",
              })
            );
          }
        }
      },
      {capture: true}
    );

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }
      const eventTarget = event.target;
      const eventTargetUrl = location.href;
      const eventTargetClassList = Array.from(eventTarget.classList);
      const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

      ipcRenderer.send(
        "event-occurred",
        JSON.stringify({
          id: eventTarget.id,
          tagName: eventTarget.tagName,
          class: eventTargetClassInfo,
          url: eventTargetUrl,
          method: "KEYDOWN",
          value: eventTarget.value,
        })
      );
    });

    document.addEventListener("change", (event) => {
      const eventTarget = event.target;
      const eventTargetUrl = location.href;
      const eventTargetClassList = Array.from(eventTarget.classList);
      const eventTargetClassInfo = getClassInfo(eventTargetClassList, eventTarget);

      ipcRenderer.send(
        "event-occurred",
        JSON.stringify({
          id: eventTarget.id,
          tagName: eventTarget.tagName,
          class: eventTargetClassInfo,
          url: eventTargetUrl,
          method: "CHANGE",
          value: eventTarget.value,
        })
      );
    });
  });
} catch (error) {
  console.error(error);
}
