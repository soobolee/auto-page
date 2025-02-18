import {useEffect} from "react";
import {useNavigate} from "react-router";
import EmptyCard from "../Card/EmptyCard";
import ContentCard from "../Card/ContentCard";
import Navigation from "../Navigation/Navigation";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMacroItemStore from "../../stores/useMacroItemStore";
import useTabStore from "../../stores/useTabStore";
import {nanoid} from "nanoid";

function MainContent() {
  const {setMacroStageList, startMacroExecute} = useMacroStageStore();
  const {macroItemList, setMacroItemList} = useMacroItemStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    async function getMacroItem() {
      let macroItemList = await window.electronAPI.getMacroItem();

      if (macroItemList.length === 0) {
        macroItemList = [];
      }

      const parseItemList = macroItemList.map((macroItem) => {
        const macroName = Object.keys(macroItem)[0];

        return {[macroName]: macroItem[macroName]};
      });

      setMacroItemList(parseItemList);
    }

    getMacroItem();
  }, [setMacroItemList]);

  return (
    <div className="flex h-[90%]">
      <Navigation />
      <article className="w-full h-full flex justify-center items-center">
        <div className="w-[90%] h-[90%] bg-sub rounded-xl flex justify-center items-center flex-col">
          <p className="mt-12 text-3xl text-white">매크로를 추가하고 바로 시작해 보세요.</p>
          <div className="w-full h-full p-16 flex flex-row flex-wrap">
            {macroItemList.length > 0 &&
              macroItemList.map((item) => (
                <ContentCard
                  key={nanoid()}
                  macroItem={item}
                  onClick={() => {
                    const macroList = JSON.parse(Object.values(item)[0]);
                    setMacroStageList(macroList);
                    setBrowserTabList([{tabUrl: macroList[0].url}]);
                    startMacroExecute();
                    navigate("/macro");
                  }}
                />
              ))}
            <EmptyCard />
          </div>
        </div>
      </article>
    </div>
  );
}

export default MainContent;
