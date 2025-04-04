import {nanoid} from "nanoid";

import useMacroStageStore from "../../stores/useMacroStageStore";
import useModalStore from "../../stores/useModalStore";
import Button from "../Button/Button";
import StageCard from "../Card/StageCard";

function TextNavigation() {
  const {macroStageList, startMacroRecord, isMacroRecording} = useMacroStageStore();
  const {openInputModal} = useModalStore();

  const startRecord = () => {
    startMacroRecord();
  };

  const finishRecord = () => {
    if (macroStageList.length > 1) {
      openInputModal();
    }
  };

  return (
    <aside className="w-full h-[15%] p-5 flex justify-between items-center flex-row border col-span-8">
      <Button buttonText={"시작"} buttonColor={"bg-green"} onClick={startRecord} />
      <div className="w-[90%] h-full flex overflow-auto">
        {macroStageList.map((stageInfo) => (
          <StageCard key={nanoid()} direction={"row"} stageInfo={stageInfo} />
        ))}
      </div>
      {isMacroRecording && <Button buttonText={"정지"} buttonColor={"bg-red"} onClick={finishRecord} />}
    </aside>
  );
}

export default TextNavigation;
