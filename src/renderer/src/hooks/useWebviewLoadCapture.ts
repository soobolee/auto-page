import {CapturePage} from "@renderer/types/macro";
import {MacroStore} from "@renderer/types/stores";
import {WebviewTag} from "electron";
import {RefObject, useEffect} from "react";

type IsMacroRecording = MacroStore["isMacroRecording"];

const useWebviewLoadCapture = (
  webViewRef: RefObject<WebviewTag | null>,
  isMacroRecording: IsMacroRecording,
  capturePage: CapturePage
) => {
  useEffect(() => {
    const currentWebview = webViewRef.current;
    if (!currentWebview) return;

    const rectInfo = currentWebview.getBoundingClientRect();
    const webviewSize = {
      x: rectInfo.x,
      y: rectInfo.y,
      width: rectInfo.width,
      height: rectInfo.height,
    };

    let timerObject: ReturnType<typeof setTimeout> | number = 0;

    if (rectInfo.width && rectInfo.height) {
      window.sessionStorage.setItem("webviewSize", JSON.stringify(webviewSize));
    }

    const captureLoadedPage = () => {
      const isEvent: string = window.sessionStorage.getItem("isEvent") || "";

      if (!isMacroRecording || !JSON.parse(isEvent)) return;

      currentWebview.removeEventListener("did-stop-loading", captureLoadedPage);

      if (timerObject) clearTimeout(timerObject);

      timerObject = setTimeout(() => {
        window.sessionStorage.setItem("isEvent", JSON.stringify(false));
        capturePage();
      }, 500);
    };

    currentWebview.addEventListener("did-stop-loading", captureLoadedPage);

    return () => {
      currentWebview.removeEventListener("did-stop-loading", captureLoadedPage);
    };
  }, [webViewRef, isMacroRecording, capturePage]);
};

export default useWebviewLoadCapture;
