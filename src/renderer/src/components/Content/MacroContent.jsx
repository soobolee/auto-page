import useTabStore from "../../stores/useTabStore";
import useMenuStore from "../../stores/useMenuStore";
import ImageNavigation from "../Navigation/ImageNavigation";
import TextNavigation from "../Navigation/TextNavigation";
import useMacroStageStore from "../../stores/useMacroStageStore";
import InputUrlContent from "./InputUrlContent";
import WebView from "../WebView/WebView";
import {RECORD_MODE} from "../../constants/textConstants";

function MacroContent() {
  const {browserTabList, tabFocusedIndex} = useTabStore();
  const {isMacroRecording} = useMacroStageStore();
  const {recordMode} = useMenuStore();

  return (
    <>
      <div className={`${recordMode === RECORD_MODE.AUTO ? "h-[90%]" : "h-[75%]"} w-full grid ${isMacroRecording && "grid-cols-8"}`}>
        {browserTabList.length <= 0 && <InputUrlContent />}
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index) => {
            return <WebView key={`${tab.tabUrl}-${index}`} url={tab.tabUrl} isHidden={tabFocusedIndex === index} index={index} />;
          })}
        <ImageNavigation />
      </div>
      {recordMode === "manual" && <TextNavigation />}
    </>
  );
}

export default MacroContent;
