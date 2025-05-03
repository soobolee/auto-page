import {useEffect} from "react";

import useMacroStore from "../stores/macro/useMacroStore";
import useModalStore from "../stores/modal/useModalStore";
import useTabStore from "../stores/tab/useTabStore";

const useWebviewMacroEvent = (webViewRef, capturePage) => {
  const {setBrowserTabList, setTabFocusedIndex, browserTabList} = useTabStore();
  const {macroStageList, macroImageList, isMacroRecording, stopMacroExecute, setMacroStageList, setMacroImageList} =
    useMacroStore();
  const {openAlertModal} = useModalStore();

  useEffect(() => {
    const currentWebview = webViewRef.current;

    if (!currentWebview) return;

    const inputEnter = async () => {
      await currentWebview.sendInputEvent({type: "keyDown", keyCode: "Enter"});
      await currentWebview.sendInputEvent({type: "char", keyCode: "Enter"});
      await currentWebview.sendInputEvent({type: "keyUp", keyCode: "Enter"});
      currentWebview.send("end-input");
    };

    const inputPaste = async () => {
      await currentWebview.sendInputEvent({type: "keyDown", keyCode: "Space"});
      await currentWebview.sendInputEvent({type: "char", keyCode: "Space"});
      await currentWebview.sendInputEvent({type: "keyUp", keyCode: "Space"});
      await currentWebview.sendInputEvent({type: "keyDown", keyCode: "Backspace"});
      await currentWebview.sendInputEvent({type: "char", keyCode: "Backspace"});
      await currentWebview.sendInputEvent({type: "keyUp", keyCode: "Backspace"});
      currentWebview.send("end-input");
    };

    const handleWebviewEvent = (event) => {
      switch (event.channel) {
        case "macro-stop": {
          window.sessionStorage.setItem("resumeMacroList", JSON.stringify(event.args[0]));
          break;
        }
        case "macro-end": {
          stopMacroExecute();
          setMacroStageList([]);
          window.sessionStorage.removeItem("resumeMacroList");
          break;
        }
        case "input-enter": {
          inputEnter();
          break;
        }
        case "input-paste": {
          inputPaste();
          break;
        }
        case "new-tab": {
          const newTab = {tabUrl: event.args[0]};
          setBrowserTabList([...browserTabList, newTab]);
          setTabFocusedIndex(browserTabList.length + event.args.length - 1);
          break;
        }
        case "client-event": {
          if (!isMacroRecording) {
            return;
          }

          const stageList = event.args[0];
          const lastStage = macroStageList[macroStageList.length - 1];

          let isDuplicate = false;

          if (stageList.tagName === "A" || stageList.href) {
            window.sessionStorage.setItem("isEvent", true);
          }

          if (lastStage) {
            isDuplicate = Object.keys(stageList).every((key) => {
              if (key !== "method") {
                return JSON.stringify(lastStage[key]) === JSON.stringify(stageList[key]);
              } else if (key === "method" && stageList[key] === "CLICK") {
                return false;
              }
              return true;
            });
          }

          if (!isDuplicate) {
            setMacroStageList([...macroStageList, stageList]);

            if (stageList.tagName !== "A" || stageList.href.includes("#")) {
              window.sessionStorage.setItem("isEvent", false);
              capturePage();
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    };

    currentWebview.addEventListener("ipc-message", handleWebviewEvent);

    return () => {
      currentWebview.removeEventListener("ipc-message", handleWebviewEvent);
    };
  }, [
    webViewRef,
    browserTabList,
    isMacroRecording,
    macroStageList,
    macroImageList,
    stopMacroExecute,
    setMacroStageList,
    setMacroImageList,
    setBrowserTabList,
    setTabFocusedIndex,
    openAlertModal,
    capturePage,
  ]);
};

export default useWebviewMacroEvent;
