import {nanoid} from "nanoid";
import {useNavigate} from "react-router";

import {ROUTER_ROUTE} from "../../constants/textConstants";
import ContentCard from "../../shared/Card/ContentCard";
import useMacroStore from "../../stores/macro/useMacroStore";
import useTabStore from "../../stores/tab/useTabStore";

function BookmarkList({macroItemList}) {
  const {setMacroStageList, startMacroExecute} = useMacroStore();
  const {setBrowserTabList} = useTabStore();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-16 flex flex-row flex-wrap">
      {macroItemList.length > 0 ? (
        macroItemList.map((item) => {
          return (
            item.bookmark && (
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
            )
          );
        })
      ) : (
        <p className="text-white mx-auto">북마크 버튼을 눌러 북마크를 등록해 편하게 보세요.</p>
      )}
    </div>
  );
}

export default BookmarkList;
