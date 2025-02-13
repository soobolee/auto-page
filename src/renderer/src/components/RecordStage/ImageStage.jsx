import {nanoid} from "nanoid";
import useMacroStageStore from "../../store/useMacroStageStore";
import StageCard from "../Card/StageCard";

function ImageStage() {
  const {macroImageList} = useMacroStageStore();

  return (
    <aside className="w-full h-full p-5 border flex flex-col overflow-scroll">
      {macroImageList.length > 0 && macroImageList.map((stageInfo) => <StageCard key={nanoid()} direction={"col"} stageInfo={stageInfo} />)}
    </aside>
  );
}

export default ImageStage;
