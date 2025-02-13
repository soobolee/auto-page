import {useEffect, useRef} from "react";
import useTabStore from "../../store/useTabStore";

function WebView({url, isHidden, index}) {
  const {browserTabList, setBrowserTabList, setTabFocusedIndex} = useTabStore();
  const webViewRef = useRef(null);

  useEffect(() => {
    const addNewTab = (event) => {
      if (event.channel === "new-tab") {
        setBrowserTabList([...browserTabList, {tabUrl: event.args[0]}]);
        setTabFocusedIndex(browserTabList.length + event.args.length - 1);
      }
    };

    webViewRef.current.addEventListener("dom-ready", () => {
      webViewRef.current.openDevTools();

      browserTabList[index].title = webViewRef.current.getTitle();
      browserTabList[index].canGoBack = webViewRef.current.canGoBack();
      browserTabList[index].canGoForward = webViewRef.current.canGoForward();

      browserTabList[index].goBack = () => {
        webViewRef.current.goBack();
      };
      browserTabList[index].goForward = () => {
        webViewRef.current.goForward();
      };
      browserTabList[index].goReload = () => {
        webViewRef.current.reload();
      };

      setBrowserTabList([...browserTabList]);
    });
    webViewRef.current.addEventListener("did-fail-load", () => {});
    webViewRef.current.addEventListener("ipc-message", addNewTab);
  }, [browserTabList, index, setBrowserTabList, setTabFocusedIndex]);

  return <webview src={url} ref={webViewRef} className={`${!isHidden && "hidden"} bg-white w-full col-span-7`}></webview>;
}

export default WebView;
