import ImageStage from "../RecordStage/ImageStage";
import TextStage from "../RecordStage/textStage";
import InputUrlContent from "./InputUrlContent";
import WebView from "../WebView/WebView";
import {useOutletContext} from "react-router";

function MacroContent() {
  const {tabList, setTabList, focusTab, setFocusTab} = useOutletContext();

  const handleTabList = (tabList) => {
    setTabList(tabList);
  };

  return (
    <>
      <div className="w-full h-[75%] grid grid-cols-8">
        {tabList.length === 0 && <InputUrlContent handleTabList={handleTabList} />}
        {tabList.length > 0 &&
          tabList.map((tabUrl, index) => {
            return (
              <WebView
                key={tabUrl}
                url={tabUrl}
                tabList={tabList}
                handleTabList={handleTabList}
                hidden={focusTab === index}
                setFocusTab={setFocusTab}
              />
            );
          })}
        <ImageStage />
      </div>
      <TextStage />
    </>
  );
}

export default MacroContent;
