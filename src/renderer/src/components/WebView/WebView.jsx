import {useEffect, useLayoutEffect, useRef} from "react";
import useTabStore from "../../stores/useTabStore";
import useMacroStageStore from "../../stores/useMacroStageStore";

function WebView({url, isHidden, index}) {
  const {browserTabList, setBrowserTabList, setTabFocusedIndex} = useTabStore();
  const {macroStageList, macroImageList, isMacroStartExecute, isMacroRecordStart, stopMacroExecute, setMacroStageList, setImageStageList} =
    useMacroStageStore();

  const webViewRef = useRef(null);

  useEffect(() => {
    if (isMacroStartExecute) {
      macroStageList.forEach((stageInfo) => {
        webViewRef.current.send("auto-macro", JSON.stringify(stageInfo));
      });
      stopMacroExecute();
    }
  }, [macroStageList, isMacroStartExecute, stopMacroExecute]);

  useLayoutEffect(() => {
    const currentWebview = webViewRef.current;

    const handleWebviewEvent = (event) => {
      if (event.channel === "new-tab") {
        setBrowserTabList([...browserTabList, {tabUrl: event.args[0]}]);
      }

      if (event.channel === "client-event") {
        if (!isMacroRecordStart) {
          return;
        }
        // const capturePage = async () => {
        //   const captureImage = await currentWebview.capturePage(0.1);
        //   const resizeImage = await captureImage.resize({
        //     width: 100,
        //     height: 100,
        //     quality: "good",
        //   });
        //   const imageUrl = await resizeImage.toDataURL();

        //   setImageStageList([...macroImageList, imageUrl]);
        // };
        // capturePage();
        const eventStageList = event.args[0];
        setMacroStageList([...macroStageList, JSON.parse(eventStageList)]);

        currentWebview.send("capture-event");
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
