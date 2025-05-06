import {WebviewTag} from "electron";
import {RefObject, useEffect} from "react";

import useMacroStore from "../stores/macro/useMacroStore";
import useTabStore from "../stores/tab/useTabStore";

const useWebviewLifecycle = (webViewRef: RefObject<WebviewTag | null>, index: number) => {
  const {browserTabList, setBrowserTabList} = useTabStore();
  const {isMacroExecuting, macroStageList} = useMacroStore();

  useEffect(() => {
    const currentWebview = webViewRef.current;
    if (!currentWebview) {
      return;
    }

    const handleDomReady = (): void => {
      if (isMacroExecuting) {
        const resumeMacroList: string = window.sessionStorage.getItem("resumeMacroList") || "";
        let parseResumeMacroList = null;

        if (resumeMacroList) {
          window.sessionStorage.removeItem("resumeMacroList");
          parseResumeMacroList = JSON.parse(resumeMacroList);
        }

        if (parseResumeMacroList && parseResumeMacroList.length > 0) {
          currentWebview.send("auto-macro", parseResumeMacroList);
        } else {
          currentWebview.send("auto-macro", macroStageList);
        }
      }

      const browserTab = browserTabList[index];
      if (!browserTab) {
        return;
      }

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
