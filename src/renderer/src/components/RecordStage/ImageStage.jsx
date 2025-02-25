import {nanoid} from "nanoid";
import useMacroStageStore from "../../stores/useMacroStageStore";
import StageCard from "../Card/StageCard";

function ImageStage() {
  const {macroImageList, isMacroRecording} = useMacroStageStore();

  return (
    isMacroRecording && (
      <aside className="w-full h-full p-5 border flex flex-col overflow-scroll">
        {macroImageList.map((stageInfo) => (
          <StageCard key={nanoid()} direction={"col"} stageInfo={stageInfo} />
        ))}
      </aside>
    )
  );
}

export default ImageStage;
