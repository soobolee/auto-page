import {nanoid} from "nanoid";
import useMacroStageStore from "../../stores/useMacroStageStore";
import StageCard from "../Card/StageCard";

function ImageNavigation() {
  const {macroImageList, isMacroRecording} = useMacroStageStore();

  return (
    isMacroRecording && (
      <aside className="w-full h-full p-5 border flex flex-col overflow-auto">
        {macroImageList.map((stageInfo) => (
          <StageCard key={nanoid()} direction={"col"} stageInfo={stageInfo} />
        ))}
      </aside>
    )
  );
}

export default ImageNavigation;
