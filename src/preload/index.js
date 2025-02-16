import {ipcRenderer} from "electron";

try {
  ipcRenderer.on("down-success", (_, macroStageList) => {
    if (macroStageList) {
      ipcRenderer.sendToHost("down-success", macroStageList);
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

    let observer = new MutationObserver((mutationList) => {
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

    document.addEventListener("click", (event) => {
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
              method: "A:CLICK",
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
              method: "BUTTON:CLICK",
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
              method: "INPUT:CLICK",
            })
          );
        }
      }
    });

    document.addEventListener("change", (event) => {
      console.log(event);
      const eventTargetUrl = location.href;
      const eventTarget = event.target;
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

      ipcRenderer.send(
        "event-occurred",
        JSON.stringify({
          id: eventTarget.id,
          class: eventTargetClassInfo,
          url: eventTargetUrl,
          method: "INPUT:INPUT",
          value: eventTarget.value,
        })
      );
    });
  });
} catch (error) {
  console.error(error);
}
