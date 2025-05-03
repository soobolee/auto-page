import {useCallback, useRef} from "react";

import {ALERT_ERROR_SAVE} from "../../constants/textConstants";
import useWebviewLifecycle from "../../hooks/useWebviewLifecycle";
import useWebviewLoadCapture from "../../hooks/useWebviewLoadCapture";
import useWebviewMacroEvent from "../../hooks/useWebviewMacroEvent";
import useMacroStore from "../../stores/macro/useMacroStore";
import useModalStore from "../../stores/modal/useModalStore";

function WebView({url, isHidden, index}) {
  const webViewRef = useRef(null);

  const {openAlertModal} = useModalStore();
  const {macroImageList, setMacroImageList} = useMacroStore();

  const capturePage = useCallback(async () => {
    const webviewSize = window.sessionStorage.getItem("webviewSize");
    const capturedPage = await window.electronAPI.capturePage(webviewSize);

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
