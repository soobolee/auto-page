import {WebviewTag} from "electron";
import {useCallback, useRef} from "react";

import {ALERT_ERROR_SAVE} from "../../constants/textConstants";
import useWebviewLifecycle from "../../hooks/useWebviewLifeCycle";
import useWebviewLoadCapture from "../../hooks/useWebviewLoadCapture";
import useWebviewMacroEvent from "../../hooks/useWebviewMacroEvent";
import useMacroStore from "../../stores/macro/useMacroStore";
import useModalStore from "../../stores/modal/useModalStore";

interface WebViewProps {
  url: string;
  isHidden: boolean;
  index: number;
}

function WebView({url, isHidden, index}: WebViewProps) {
  const webViewRef = useRef<WebviewTag>(null);

  const {openAlertModal} = useModalStore();
  const {macroImageList, setMacroImageList} = useMacroStore();

  const capturePage = useCallback(async () => {
    const webviewSize = window.sessionStorage.getItem("webviewSize");
    let capturedPage = null;

    if (typeof webviewSize === "string") {
      capturedPage = await window.electronAPI.capturePage(webviewSize);
    }

    if (!capturedPage) {
      openAlertModal(ALERT_ERROR_SAVE);
    } else {
      macroImageList.push(capturedPage);
    }

    setMacroImageList([...macroImageList]);
  }, [macroImageList, openAlertModal, setMacroImageList]);

  useWebviewMacroEvent(webViewRef, capturePage);
  useWebviewLifecycle(webViewRef, index);
  useWebviewLoadCapture(webViewRef, useMacroStore().isMacroRecording, capturePage);

  return <webview src={url} ref={webViewRef} className={`${!isHidden && "hidden"} bg-white w-full col-span-7`} />;
}

export default WebView;
