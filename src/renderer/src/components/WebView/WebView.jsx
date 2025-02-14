import {useEffect, useLayoutEffect, useRef} from "react";
import useTabStore from "../../store/useTabStore";
import useMacroStageStore from "../../store/useMacroStageStore";

function WebView({url, isHidden, index}) {
  const {browserTabList, setBrowserTabList, setTabFocusedIndex} = useTabStore();
  const {macroStageList, macroImageList, isMacroStart, stopMacro, setMacroStageList, setImageStageList} = useMacroStageStore();

  const webViewRef = useRef(null);

  useEffect(() => {
    if (isMacroStart) {
      macroStageList.forEach((stageInfo) => {
        webViewRef.current.send("auto-macro", JSON.stringify(stageInfo));
      });
      stopMacro();
    }
  }, [macroStageList, isMacroStart, stopMacro]);

  useLayoutEffect(() => {
    const currentWebview = webViewRef.current;

    const handleWebviewEvent = (event) => {
      if (event.channel === "new-tab") {
        setBrowserTabList([...browserTabList, {tabUrl: event.args[0]}]);
      }

      if (event.channel === "down-success") {
        const capturePage = async () => {
          const captureImage = await currentWebview.capturePage(0.1);
          const resizeImage = await captureImage.resize({
            width: 100,
            height: 100,
            quality: "good",
          });
          const imageUrl = await resizeImage.toDataURL();
          const eventStageList = event.args[0];

          setImageStageList([...macroImageList, imageUrl]);
          setMacroStageList(JSON.parse(eventStageList));
        };

        capturePage();
      }
    };

    currentWebview.addEventListener("ipc-message", handleWebviewEvent);

    return () => {
      currentWebview.removeEventListener("ipc-message", handleWebviewEvent);
    };
  }, [browserTabList, macroImageList, setBrowserTabList, setImageStageList, setMacroStageList, setTabFocusedIndex]);

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
