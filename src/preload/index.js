import {contextBridge, ipcRenderer} from "electron";

try {
  contextBridge.exposeInMainWorld("electronAPI", {});

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
      const aTag = event.target.closest("a");
      const buttonTag = event.target.closest("button");
      const iButtonTag = event.target.closest("input[type='button']");

      if (aTag && aTag.target === "_blank") {
        ipcRenderer.sendToHost("new-tab", aTag.href);
      }
      if (buttonTag) {
        ipcRenderer.sendToHost("click-button", buttonTag.toString());
      }
      if (iButtonTag) {
        ipcRenderer.sendToHost("click-i-button", iButtonTag.toString());
      }
    });
  });
} catch (error) {
  console.error(error);
}
