import {RECORD_MODE} from "../../constants/textConstants";
import ImageNavigation from "../../layout/Navigation/ImageNavigation";
import TextNavigation from "../../layout/Navigation/TextNavigation";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useTabStore from "../../stores/tab/useTabStore";
import WebView from "../webview/WebView";
import InputUrlContent from "./InputUrlContent";

function MacroContent() {
  const {browserTabList, tabFocusedIndex} = useTabStore();
  const {isMacroRecording} = useMacroStore();
  const {recordMode} = useMenuStore();

  return (
    <>
      <div
        className={`${recordMode === RECORD_MODE.STOP ? "h-[90%]" : "h-[75%]"} w-full grid ${isMacroRecording && "grid-cols-8"}`}
      >
        {browserTabList.length <= 0 && <InputUrlContent />}
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index) => {
            return (
              <WebView
                key={`${tab.tabUrl}-${index}`}
                url={tab.tabUrl}
                isHidden={tabFocusedIndex === index}
                index={index}
              />
            );
          })}
        <ImageNavigation />
      </div>
      {recordMode === RECORD_MODE.START && <TextNavigation />}
    </>
  );
}

export default MacroContent;
