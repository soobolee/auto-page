import {MacroItem} from "@renderer/types/macro";
import {nanoid} from "nanoid";

import ShortCutCard from "../../shared/Card/ShortCutCard";

function ShortcutList({macroItemList}: {macroItemList: MacroItem[]}) {
  return (
    <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-auto">
      {macroItemList.length > 0 ? (
        macroItemList.map((item: MacroItem) => <ShortCutCard key={nanoid()} macroItem={item} />)
      ) : (
        <p className="text-white">매크로가 없습니다. 매크로를 등록해주세요.</p>
      )}
    </div>
  );
}

export default ShortcutList;
