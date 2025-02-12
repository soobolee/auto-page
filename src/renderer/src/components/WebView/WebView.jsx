import {useEffect, useRef} from "react";
import useTabStore from "../../store/useTabStore";

function WebView({url, isHidden}) {
  const {browserTabList, setBrowserTabList, setTabFocusedIndex} = useTabStore();
  const webViewRef = useRef(null);

  useEffect(() => {
    const addNewTab = (event) => {
      if (event.channel === "new-tab") {
        setBrowserTabList([...browserTabList, ...event.args]);
        setTabFocusedIndex(browserTabList.length + event.args.length - 1);
      }
    };

    webViewRef.current.addEventListener("dom-ready", () => {
      webViewRef.current.openDevTools();
    });
    webViewRef.current.addEventListener("did-fail-load", () => {});
    webViewRef.current.addEventListener("ipc-message", addNewTab);
  }, [browserTabList, setBrowserTabList, setTabFocusedIndex]);

  return <webview src={url} ref={webViewRef} className={`${!isHidden && "hidden"} bg-white w-full col-span-7`}></webview>;
}

export default WebView;
