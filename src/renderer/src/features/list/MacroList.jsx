import {nanoid} from "nanoid";
import {useNavigate} from "react-router";

import {ROUTER_ROUTE} from "../../constants/textConstants";
import ContentCard from "../../shared/Card/ContentCard";
import EmptyCard from "../../shared/Card/EmptyCard";
import useMacroStore from "../../stores/macro/useMacroStore";
import useTabStore from "../../stores/tab/useTabStore";

function MacroList({macroItemList}) {
  const {setMacroStageList, startMacroExecute} = useMacroStore();
  const {setBrowserTabList} = useTabStore();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-16 flex justify-center flex-row flex-wrap overflow-auto">
      {macroItemList.length > 0 &&
        macroItemList.map((item) => (
          <ContentCard
            key={nanoid()}
            macroItem={item}
            onClick={() => {
              setMacroStageList(item.stageList);
              setBrowserTabList([{tabUrl: item.stageList[0].url}]);
              startMacroExecute();
              navigate(ROUTER_ROUTE.MACRO);
            }}
          />
        ))}
      <EmptyCard />
    </div>
  );
}

export default MacroList;
