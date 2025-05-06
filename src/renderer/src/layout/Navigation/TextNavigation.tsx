import {nanoid} from "nanoid";
import {JSX} from "react";

import Button from "../../shared/Button/Button";
import StageCard from "../../shared/Card/StageCard";
import useMacroStore from "../../stores/macro/useMacroStore";
import useModalStore from "../../stores/modal/useModalStore";

function TextNavigation(): JSX.Element {
  const {macroStageList, startMacroRecord, isMacroRecording} = useMacroStore();
  const {openInputModal} = useModalStore();

  const startRecord = (): void => {
    startMacroRecord();
  };

  const finishRecord = (): void => {
    if (macroStageList.length > 1) {
      openInputModal();
    }
  };

  return (
    <aside className="w-full h-[15%] p-5 flex justify-between items-center flex-row border col-span-8">
      <Button color="green" onClick={startRecord}>
        시작
      </Button>
      <div className="w-[90%] h-full flex overflow-auto">
        {macroStageList.map((stageInfo) => (
          <StageCard key={nanoid()} direction={"row"} stageInfo={stageInfo} />
        ))}
      </div>
      {isMacroRecording && (
        <Button color="red" onClick={finishRecord}>
          정지
        </Button>
      )}
    </aside>
  );
}

export default TextNavigation;
