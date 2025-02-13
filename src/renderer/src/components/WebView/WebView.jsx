import {useEffect, useRef} from "react";
import useTabStore from "../../store/useTabStore";
import useStageStore from "../../store/useMacroStageStore";

function WebView({url, isHidden, index}) {
  const {browserTabList, setBrowserTabList, setTabFocusedIndex} = useTabStore();
  const {setMacroStageList} = useStageStore();

  const webViewRef = useRef(null);

  useEffect(() => {
    const eventHandling = (event) => {
      if (event.channel === "new-tab") {
        setBrowserTabList([...browserTabList, {tabUrl: event.args[0]}]);
        setTabFocusedIndex(browserTabList.length + event.args.length - 1);
      }

      if (event.channel === "process-success") {
        const eventStageInfo = event.args[0];
        setMacroStageList(JSON.parse(eventStageInfo));
      }
    };

    webViewRef.current.addEventListener("dom-ready", () => {
      webViewRef.current.openDevTools();

      const browserTab = browserTabList[index];

      browserTab.title = webViewRef.current.getTitle();
      browserTab.canGoBack = webViewRef.current.canGoBack();
      browserTab.canGoForward = webViewRef.current.canGoForward();

      browserTab.goBack = () => {
        webViewRef.current.goBack();
      };
      browserTab.goForward = () => {
        webViewRef.current.goForward();
      };
      browserTab.goReload = () => {
        webViewRef.current.reload();
      };

      setBrowserTabList([...browserTabList]);
    });
    webViewRef.current.addEventListener("did-fail-load", () => {});
    webViewRef.current.addEventListener("ipc-message", eventHandling);
  }, [browserTabList, index, setBrowserTabList, setMacroStageList, setTabFocusedIndex]);

  return <webview src={url} ref={webViewRef} className={`${!isHidden && "hidden"} bg-white w-full col-span-7`}></webview>;
}

export default WebView;
