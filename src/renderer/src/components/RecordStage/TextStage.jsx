import {nanoid} from "nanoid";
import useMacroStageStore from "../../store/useMacroStageStore";
import Button from "../Button/Button";
import StageCard from "../Card/StageCard";

function TextStage() {
  const {macroStageList} = useMacroStageStore();

  return (
    <aside className="w-full h-[15%] p-5 flex justify-between items-center flex-row border col-span-8">
      <Button buttonText={"시작"} buttonColor={"bg-green"} />
      <div className="w-[90%] h-full flex overflow-scroll">
        {macroStageList.length > 0 && macroStageList.map((stageInfo) => <StageCard key={nanoid()} direction={"row"} stageInfo={stageInfo} />)}
      </div>
      <Button buttonText={"정지"} buttonColor={"bg-red"} />
    </aside>
  );
}

export default TextStage;
