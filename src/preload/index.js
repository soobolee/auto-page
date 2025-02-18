import {ipcRenderer, contextBridge} from "electron";

try {
  contextBridge.exposeInMainWorld("electronAPI", {
    getMacroItem: () => ipcRenderer.invoke("get-macro-item"),
    saveMacro: (fileName, fileContent) => ipcRenderer.invoke("save-macro", fileName, fileContent),
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
  ipcRenderer.on("auto-macro", (_, macroStageInfo) => {
    let isActived = false;
    const stageInfo = JSON.parse(macroStageInfo);

    if (stageInfo.id) {
      document.querySelector(`#${stageInfo.id}`).click();
      isActived = true;
    }

    if (!isActived && stageInfo.class) {
      stageInfo.class.forEach((classInfo) => {
        document.querySelectorAll(`.${classInfo.className}`)[classInfo.classIndex].click();
      });
    }
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
