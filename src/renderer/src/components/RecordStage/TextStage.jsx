import {nanoid} from "nanoid";
import useMacroStageStore from "../../stores/useMacroStageStore";
import Button from "../Button/Button";
import StageCard from "../Card/StageCard";

function TextStage() {
  const {macroStageList, resetStageList} = useMacroStageStore();

  const finishRecord = () => {
    window.electronAPI.saveMacro("", macroStageList);
    resetStageList();
  };

  return (
    <aside className="w-full h-[15%] p-5 flex justify-between items-center flex-row border col-span-8">
      <Button buttonText={"시작"} buttonColor={"bg-green"} />
      <div className="w-[90%] h-full flex overflow-scroll">
        {macroStageList.length > 0 && macroStageList.map((stageInfo) => <StageCard key={nanoid()} direction={"row"} stageInfo={stageInfo} />)}
      </div>
      <Button buttonText={"정지"} buttonColor={"bg-red"} onClick={finishRecord} />
    </aside>
  );
}

export default TextStage;
