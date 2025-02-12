import useTabStore from "../../store/useTabStore";
import ImageStage from "../RecordStage/ImageStage";
import TextStage from "../RecordStage/textStage";
import InputUrlContent from "./InputUrlContent";
import WebView from "../WebView/WebView";

function MacroContent() {
  const {browserTabList, tabFocusedIndex} = useTabStore();

  return (
    <>
      <div className="w-full h-[75%] grid grid-cols-8">
        {browserTabList.length === 0 && <InputUrlContent />}
        {browserTabList.length > 0 &&
          browserTabList.map((tabUrl, index) => {
            return <WebView key={tabUrl} url={tabUrl} isHidden={tabFocusedIndex === index} />;
          })}
        <ImageStage />
      </div>
      <TextStage />
    </>
  );
}

export default MacroContent;
