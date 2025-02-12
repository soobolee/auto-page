import {useEffect, useRef} from "react";

function WebView({url, tabList, handleTabList, hidden, setFocusTab}) {
  const webViewRef = useRef(null);

  useEffect(() => {
    const addNewTab = (event) => {
      if (event.channel === "new-tab") {
        handleTabList([...tabList, ...event.args]);
        setFocusTab(tabList.length + event.args.length - 1);
      }
    };

    webViewRef.current.addEventListener("dom-ready", () => {
      webViewRef.current.openDevTools();
    });
    webViewRef.current.addEventListener("did-fail-load", () => {});
    webViewRef.current.addEventListener("ipc-message", addNewTab);
  }, [handleTabList, setFocusTab, tabList]);

  return <webview ref={webViewRef} className={`${!hidden && "hidden"} bg-white w-full col-span-7`} src={url}></webview>;
}

export default WebView;
