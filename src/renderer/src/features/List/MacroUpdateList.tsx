import {MacroItem, MacroStage} from "@renderer/types/macro";
import {nanoid} from "nanoid";
import {ChangeEvent} from "react";

import UpdateCard from "../../shared/Card/UpdateCard";

interface UpdateListProps {
  macroStageList: MacroStage[];
  updateTargetMacroName: string;
  handleUpdateSelect: (event: ChangeEvent<HTMLSelectElement>) => void;
  macroItemList: MacroItem[];
}

function UpdateList({macroStageList, updateTargetMacroName, handleUpdateSelect, macroItemList}: UpdateListProps) {
  return (
    <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-auto">
      <div>
        <select
          value={updateTargetMacroName}
          onChange={handleUpdateSelect}
          className="w-100 p-4 bg-white text-lg rounded-xl"
        >
          <option>매크로를 선택해 주세요.</option>
          {macroItemList &&
            macroItemList.map((macroItem) => (
              <option key={nanoid()} value={macroItem.macroName}>
                {macroItem.macroName}
              </option>
            ))}
        </select>
      </div>
      {macroStageList &&
        macroStageList.map((stageItem, index) => <UpdateCard key={nanoid()} stageItem={stageItem} index={index} />)}
    </div>
  );
}

export default UpdateList;
