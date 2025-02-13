import {nanoid} from "nanoid";
import useMacroStageStore from "../../store/useMacroStageStore";
import StageCard from "../Card/StageCard";

function ImageStage() {
  const {macroStageList} = useMacroStageStore();

  return (
    <aside className="w-full h-full p-5 border flex flex-col overflow-scroll">
      {macroStageList.length > 0 && macroStageList.map((stageInfo) => <StageCard key={nanoid()} direction={"col"} stageInfo={stageInfo} />)}
    </aside>
  );
}

export default ImageStage;
