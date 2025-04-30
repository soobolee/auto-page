import {nanoid} from "nanoid";

import StageCard from "../../shared/Card/StageCard";
import useMacroStore from "../../stores/macro/useMacroStore";

function ImageNavigation() {
  const {macroImageList, isMacroRecording} = useMacroStore();

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
