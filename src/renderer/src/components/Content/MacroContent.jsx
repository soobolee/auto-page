import {useState} from "react";
import ImageStage from "../RecordStage/ImageStage";
import TextStage from "../RecordStage/textStage";
import InputUrlContent from "./InputUrlContent";
import WebView from "../WebView/WebView";

function MacroContent() {
  const [userInputUrl, setUserInputUrl] = useState("");
  const [hasUrl, setHasUrl] = useState(false);

  const handleUrlInput = (event) => {
    setUserInputUrl(event);
  };

  const handleSetHasUrl = (e) => {
    setHasUrl(e);
  };

  return (
    <>
      <div className="w-full h-[75%] grid grid-cols-8">
        {!hasUrl && <InputUrlContent setUserInputUrl={handleUrlInput} setHasUrl={handleSetHasUrl} />}
        {hasUrl && <WebView url={userInputUrl} />}
        <ImageStage />
      </div>
      <TextStage />
    </>
  );
}

export default MacroContent;
