import useUserConfigStore from "../../stores/useUserConfigStore";
import useTabStore from "../../stores/useTabStore";
import useMenuStore from "../../stores/useMenuStore";
import ImageStage from "../RecordStage/ImageStage";
import TextStage from "../RecordStage/TextStage";
import InputUrlContent from "./InputUrlContent";
import WebView from "../WebView/WebView";
import DimModal from "../Modal/DimModal";

function MacroContent() {
  const {browserTabList, tabFocusedIndex} = useTabStore();
  const {isShowModal} = useUserConfigStore();
  const {recordMode} = useMenuStore();

  return (
    <>
      <div className={`${recordMode === "auto" ? "h-[90%]" : "h-[75%]"} w-full grid grid-cols-8`}>
        {browserTabList.length <= 0 && <InputUrlContent />}
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index) => {
            return <WebView key={`${tab.tabUrl}-${index}`} url={tab.tabUrl} isHidden={tabFocusedIndex === index} index={index} />;
          })}
        <ImageStage />
      </div>
      {recordMode === "manual" && <TextStage />}
      {isShowModal && <DimModal />}
    </>
  );
}

export default MacroContent;
