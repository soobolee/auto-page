import {contextBridge, ipcRenderer} from "electron";

try {
  contextBridge.exposeInMainWorld("electronAPI", {});

  ipcRenderer.on("down-success", (_, macroStageList) => {
    if (macroStageList) {
      ipcRenderer.sendToHost("process-success", macroStageList);
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    if (document.title === "Auto Page") {
      return;
    }

    setTimeout(() => {
      const iframe = document.getElementsByTagName("iframe");
      Array.from(iframe).forEach((frame) => {
        frame.remove();
      });
    }, 3000);

    document.addEventListener("click", (event) => {
      if (event.isTrusted) {
        const eventTargetUrl = location.href;
        const aTag = event.target.closest("a");
        const buttonTag = event.target.closest("button");
        const iButtonTag = event.target.closest("input[type='button']");

        const eventTarget = aTag || buttonTag || iButtonTag;
        const eventTargetId = eventTarget.getAttribute("id");
        const eventTargetClassList = Array.from(eventTarget.classList);
        let eventTargetClassInfo = [];

        if (eventTargetClassList.length) {
          eventTargetClassInfo = eventTargetClassList.map((className) => {
            const duplicatedClassList = Array.from(document.getElementsByClassName(className));

            return {
              className: className,
              classIndex: duplicatedClassList.indexOf(eventTarget),
            };
          });
        }

        if (aTag) {
          if (aTag.target === "_blank") {
            ipcRenderer.sendToHost("new-tab", aTag.href);
          }

          ipcRenderer.send(
            "event-occurred",
            JSON.stringify({
              id: eventTargetId,
              class: eventTargetClassInfo,
              href: aTag.href,
              url: eventTargetUrl,
              method: "A",
            })
          );
        }

        if (buttonTag) {
          ipcRenderer.send(
            "event-occurred",
            JSON.stringify({
              id: eventTargetId,
              class: eventTargetClassInfo,
              url: eventTargetUrl,
              method: "BUTTON",
            })
          );
        }

        if (iButtonTag) {
          ipcRenderer.send(
            "event-occurred",
            JSON.stringify({
              id: eventTargetId,
              class: eventTargetClassInfo,
              url: eventTargetUrl,
              method: "INPUT",
            })
          );
        }
      }
    });
  });
} catch (error) {
  console.error(error);
}
