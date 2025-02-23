import {useEffect, useCallback, useRef} from "react";
import useTabStore from "../../stores/useTabStore";
import useMacroStageStore from "../../stores/useMacroStageStore";

function WebView({url, isHidden, index}) {
  const {browserTabList, setBrowserTabList, setTabFocusedIndex} = useTabStore();
  const {macroStageList, macroImageList, isMacroExecuting, stopMacroExecute, isMacroRecording, setMacroStageList, setImageStageList} =
    useMacroStageStore();

  const webViewRef = useRef(null);

  const capturePage = useCallback(async () => {
    const webviewSize = window.sessionStorage.getItem("webviewSize");
    const capturedPage = await window.electronAPI.capturePage(webviewSize);
    macroImageList.push(capturedPage);

    setImageStageList([...macroImageList]);
  }, [macroImageList, setImageStageList]);

  useEffect(() => {
    const currentWebview = webViewRef.current;
    let timerObject = null;

    const rectInfo = currentWebview.getBoundingClientRect();
    const webviewSize = {
      x: rectInfo.x,
      y: rectInfo.y,
      width: rectInfo.width,
      height: rectInfo.height,
    };

    window.sessionStorage.setItem("webviewSize", JSON.stringify(webviewSize));

    const captureLoadedPage = () => {
      const isEvent = window.sessionStorage.getItem("isEvent");

      if (!isMacroRecording || !JSON.parse(isEvent)) {
        return;
      }

      currentWebview.removeEventListener("did-stop-loading", captureLoadedPage);

      if (timerObject) {
        clearTimeout(timerObject);
      } else {
        timerObject = setTimeout(() => {
          window.sessionStorage.setItem("isEvent", false);
          capturePage();
        }, 600);
      }
    };

    currentWebview.addEventListener("did-stop-loading", captureLoadedPage);
    return () => {
      currentWebview.removeEventListener("did-stop-loading", captureLoadedPage);
    };
  }, [isMacroRecording, macroImageList, setImageStageList, capturePage]);

  useEffect(() => {
    const currentWebview = webViewRef.current;

    const inputEnter = async () => {
      currentWebview.sendInputEvent({type: "keyDown", keyCode: "Enter"});
      currentWebview.sendInputEvent({type: "char", keyCode: "Enter"});
      await currentWebview.sendInputEvent({type: "keyUp", keyCode: "Enter"});
    };

    const inputPaste = async () => {
      currentWebview.sendInputEvent({type: "keyDown", keyCode: "Space"});
      currentWebview.sendInputEvent({type: "char", keyCode: "Space"});
      currentWebview.sendInputEvent({type: "keyUp", keyCode: "Space"});
      currentWebview.sendInputEvent({type: "keyDown", keyCode: "Backspace"});
      currentWebview.sendInputEvent({type: "char", keyCode: "Backspace"});
      await currentWebview.sendInputEvent({type: "keyUp", keyCode: "BackSpace"});
    };

    const handleWebviewEvent = (event) => {
      if (event.channel === "macro-stop") {
        window.sessionStorage.setItem("resumeMacroList", JSON.stringify(event.args[0]));
      }

      if (event.channel === "macro-end") {
        stopMacroExecute();
        setMacroStageList([]);
        window.sessionStorage.removeItem("resumeMacroList");
      }

      if (event.channel === "input-enter") {
        inputEnter();
      }

      if (event.channel === "input-paste") {
        inputPaste();
      }

      if (event.channel === "new-tab") {
        setBrowserTabList([...browserTabList, {tabUrl: event.args[0]}]);
        setTabFocusedIndex(browserTabList.length + event.args.length - 1);
      }

      if (event.channel === "client-event") {
        if (!isMacroRecording) {
          return;
        }

        const stageList = event.args[0];
        const lastStage = macroStageList[macroStageList.length - 1];
        let isDuplicate = false;

        if (stageList.tagName === "A" || stageList.href) {
          window.sessionStorage.setItem("isEvent", true);
        }

        if (lastStage) {
          isDuplicate = Object.keys(stageList).every((key) => {
            if (key !== "method") {
              return JSON.stringify(lastStage[key]) === JSON.stringify(stageList[key]);
            } else if (key === "method" && stageList[key] === "CLICK") {
              return false;
            }
            return true;
          });
        }

        if (!isDuplicate) {
          setMacroStageList([...macroStageList, stageList]);

          if (stageList.tagName !== "A" || !stageList.href) {
            window.sessionStorage.setItem("isEvent", false);
            capturePage();
          }
        }
      }
    };

    currentWebview.addEventListener("ipc-message", handleWebviewEvent);

    return () => {
      currentWebview.removeEventListener("ipc-message", handleWebviewEvent);
    };
  }, [
    browserTabList,
    isMacroRecording,
    macroImageList,
    macroStageList,
    stopMacroExecute,
    setBrowserTabList,
    setImageStageList,
    setMacroStageList,
    setTabFocusedIndex,
    capturePage,
  ]);

  useEffect(() => {
    const currentWebview = webViewRef.current;

    const handleDomReady = () => {
      if (isMacroExecuting) {
        const resumeMacroList = window.sessionStorage.getItem("resumeMacroList");
        const parseResumeMacroList = JSON.parse(resumeMacroList);

        if (parseResumeMacroList && parseResumeMacroList.length > 0) {
          webViewRef.current.send("auto-macro", parseResumeMacroList);
        } else {
          webViewRef.current.send("auto-macro", macroStageList);
        }
      }

      const browserTab = browserTabList[index];

      browserTab.title = currentWebview.getTitle();
      browserTab.canGoBack = currentWebview.canGoBack();
      browserTab.canGoForward = currentWebview.canGoForward();

      browserTab.goBack = () => {
        currentWebview.goBack();
      };
      browserTab.goForward = () => {
        currentWebview.goForward();
      };
      browserTab.goReload = () => {
        currentWebview.reload();
      };

      setBrowserTabList([...browserTabList]);
    };

    currentWebview.addEventListener("dom-ready", handleDomReady);

    return () => {
      currentWebview.removeEventListener("dom-ready", handleDomReady);
    };
  }, [browserTabList, index, isMacroExecuting, macroStageList, setBrowserTabList]);

  return <webview src={url} ref={webViewRef} className={`${!isHidden && "hidden"} bg-white w-full col-span-7`}></webview>;
}

export default WebView;
