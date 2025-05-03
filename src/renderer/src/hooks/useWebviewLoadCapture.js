import {useEffect} from "react";

const useWebviewLoadCapture = (webViewRef, isMacroRecording, capturePage) => {
  useEffect(() => {
    const currentWebview = webViewRef.current;
    if (!currentWebview) return;

    let timerObject = null;

    const rectInfo = currentWebview.getBoundingClientRect();
    const webviewSize = {
      x: rectInfo.x,
      y: rectInfo.y,
      width: rectInfo.width,
      height: rectInfo.height,
    };

    if (rectInfo.width && rectInfo.height) {
      window.sessionStorage.setItem("webviewSize", JSON.stringify(webviewSize));
    }

    const captureLoadedPage = () => {
      const isEvent = window.sessionStorage.getItem("isEvent");

      if (!isMacroRecording || !JSON.parse(isEvent)) return;

      currentWebview.removeEventListener("did-stop-loading", captureLoadedPage);

      if (timerObject) clearTimeout(timerObject);

      timerObject = setTimeout(() => {
        window.sessionStorage.setItem("isEvent", false);
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
