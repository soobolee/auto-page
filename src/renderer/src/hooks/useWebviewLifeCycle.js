import {useEffect} from "react";

import useMacroStore from "../stores/macro/useMacroStore";
import useTabStore from "../stores/tab/useTabStore";

const useWebviewLifecycle = (webViewRef, index) => {
  const {browserTabList, setBrowserTabList} = useTabStore();
  const {isMacroExecuting, macroStageList} = useMacroStore();

  useEffect(() => {
    const currentWebview = webViewRef.current;
    if (!currentWebview) return;

    const handleDomReady = () => {
      if (isMacroExecuting) {
        const resumeMacroList = window.sessionStorage.getItem("resumeMacroList");
        window.sessionStorage.removeItem("resumeMacroList");

        const parsed = JSON.parse(resumeMacroList);
        const listToSend = parsed && parsed.length > 0 ? parsed : macroStageList;

        currentWebview.send("auto-macro", listToSend);
      }

      const browserTab = browserTabList[index];
      if (!browserTab) return;

      browserTab.title = currentWebview.getTitle();
      browserTab.canGoBack = currentWebview.canGoBack();
      browserTab.canGoForward = currentWebview.canGoForward();

      browserTab.goBack = () => currentWebview.goBack();
      browserTab.goForward = () => currentWebview.goForward();
      browserTab.goReload = () => currentWebview.reloadIgnoringCache();

      setBrowserTabList([...browserTabList]);
    };

    currentWebview.addEventListener("dom-ready", handleDomReady);

    return () => {
      currentWebview.removeEventListener("dom-ready", handleDomReady);
    };
  }, [webViewRef, browserTabList, index, isMacroExecuting, macroStageList, setBrowserTabList]);
};

export default useWebviewLifecycle;
