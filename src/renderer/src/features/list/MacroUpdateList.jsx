import {nanoid} from "nanoid";

import UpdateCard from "../../shared/Card/UpdateCard";

function UpdateList({macroStageList, updateTargetMacroName, handleUpdateSelect, macroItemList}) {
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
