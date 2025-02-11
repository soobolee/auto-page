import {useRef} from "react";

function WebView({url}) {
  const webViewRef = useRef("");

  return <webview ref={webViewRef} className="w-full col-span-7" src={url}></webview>;
}

export default WebView;
