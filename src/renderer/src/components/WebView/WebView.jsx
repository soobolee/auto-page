import {useEffect, useLayoutEffect, useRef} from "react";
import useTabStore from "../../stores/useTabStore";
import useMacroStageStore from "../../stores/useMacroStageStore";

function WebView({url, isHidden, index}) {
  const {browserTabList, setBrowserTabList, setTabFocusedIndex} = useTabStore();
  const {macroStageList, macroImageList, isMacroStartExecute, isMacroRecordStart, stopMacroExecute, setMacroStageList, setImageStageList} =
    useMacroStageStore();

  const webViewRef = useRef(null);

  useEffect(() => {
    const rectInfo = webViewRef.current.getBoundingClientRect();
    const webviewSize = {
      x: rectInfo.x,
      y: rectInfo.y,
      width: rectInfo.width,
      height: rectInfo.height,
    };

    window.sessionStorage.setItem("webviewSize", JSON.stringify(webviewSize));

    if (isMacroStartExecute) {
      macroStageList.forEach((stageInfo) => {
        webViewRef.current.send("auto-macro", JSON.stringify(stageInfo));
      });
      stopMacroExecute();
    }
  }, [macroStageList, isMacroStartExecute, stopMacroExecute]);

  useLayoutEffect(() => {
    const currentWebview = webViewRef.current;

    const capturePage = async () => {
      const webviewSize = window.sessionStorage.getItem("webviewSize");
      const capturedPage = await window.electronAPI.capturePage(webviewSize);
      macroImageList.push(capturedPage);

      setImageStageList([...macroImageList]);
    };

    const handleWebviewEvent = (event) => {
      if (event.channel === "new-tab") {
        setBrowserTabList([...browserTabList, {tabUrl: event.args[0]}]);
        setTabFocusedIndex(browserTabList.length + event.args.length - 1);
      }

      if (event.channel === "client-event") {
        if (!isMacroRecordStart) {
          return;
        }

        const eventStageList = event.args[0];
        const stageList = JSON.parse(eventStageList);

        setMacroStageList([...macroStageList, stageList]);

        capturePage();
      }
    };

    currentWebview.addEventListener("ipc-message", handleWebviewEvent);

    return () => {
      currentWebview.removeEventListener("ipc-message", handleWebviewEvent);
    };
  }, [
    browserTabList,
    isMacroRecordStart,
    macroImageList,
    macroStageList,
    setBrowserTabList,
    setImageStageList,
    setMacroStageList,
    setTabFocusedIndex,
  ]);

  useLayoutEffect(() => {
    const currentWebview = webViewRef.current;

    const handleDomReady = () => {
      currentWebview.openDevTools();

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
  }, [browserTabList, index, setBrowserTabList]);

  return <webview src={url} ref={webViewRef} className={`${!isHidden && "hidden"} bg-white w-full col-span-7`}></webview>;
}

export default WebView;
