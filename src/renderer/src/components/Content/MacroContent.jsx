import {RECORD_MODE} from "../../constants/textConstants";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMenuStore from "../../stores/useMenuStore";
import useTabStore from "../../stores/useTabStore";
import ImageNavigation from "../Navigation/ImageNavigation";
import TextNavigation from "../Navigation/TextNavigation";
import WebView from "../WebView/WebView";
import InputUrlContent from "./InputUrlContent";

function MacroContent() {
  const {browserTabList, tabFocusedIndex} = useTabStore();
  const {isMacroRecording} = useMacroStageStore();
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
