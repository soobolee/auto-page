import {nanoid} from "nanoid";
import {useEffect} from "react";
import {useNavigate} from "react-router";
import EmptyCard from "../Card/EmptyCard";
import ContentCard from "../Card/ContentCard";
import ShortCutCard from "../Card/ShortcutCard";
import Navigation from "../Navigation/Navigation";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMacroItemStore from "../../stores/useMacroItemStore";
import useUserConfigStore from "../../stores/useUserConfigStore";
import useMenuStore from "../../stores/useMenuStore";
import useTabStore from "../../stores/useTabStore";

function MainContent() {
  const {menuMode} = useMenuStore();
  const {setMacroStageList, startMacroExecute} = useMacroStageStore();
  const {shortCutList, shortCutUnitList, setShortCutUnitList} = useUserConfigStore();
  const {macroItemList, setMacroItemList} = useMacroItemStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    async function getMacroItem() {
      const macroInfoList = await window.electronAPI.getMacroItem();

      setMacroItemList(macroInfoList);
    }

    getMacroItem();
  }, [setMacroItemList, menuMode]);

  useEffect(() => {
    const handleShortCut = (event) => {
      if (event.target.tagName === "INPUT") {
        return;
      }

      setShortCutUnitList([...shortCutUnitList, event.key]);

      if (shortCutUnitList.length === 1) {
        const macroInfo = macroItemList.find((macroItem) => {
          if (macroItem.shortCut) {
            return macroItem.shortCut.firstKeyUnit === shortCutUnitList[0] && macroItem.shortCut.secondKeyUnit === event.key;
          }
        });

        if (!macroInfo) {
          return;
        }

        setMacroStageList(macroInfo.stageList);
        setBrowserTabList([{tabUrl: macroInfo.stageList[0].url}]);
        startMacroExecute();
        navigate("/macro");
      }
    };

    const handleKeyup = (event) => {
      if (event.target.tagName === "INPUT") {
        return;
      }

      setShortCutUnitList([]);
    };

    document.addEventListener("keydown", handleShortCut);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      document.removeEventListener("keydown", handleShortCut);
      document.removeEventListener("keyup", handleKeyup);
    };
  }, [
    macroItemList,
    menuMode,
    navigate,
    setBrowserTabList,
    setMacroStageList,
    setShortCutUnitList,
    shortCutList,
    shortCutUnitList,
    startMacroExecute,
  ]);

  return (
    <div className="flex h-[90%]">
      <Navigation />
      <article className="w-full h-full flex justify-center items-center">
        <div className="w-[90%] h-[90%] bg-sub rounded-xl flex justify-center items-center flex-col">
          <p className="mt-12 text-3xl text-white">매크로를 추가하고 바로 시작해 보세요.</p>
          {menuMode === "HOME" && (
            <div className="w-full h-full p-16 flex flex-row flex-wrap">
              {macroItemList.length > 0 &&
                macroItemList.map((item) => (
                  <ContentCard
                    key={nanoid()}
                    macroItem={item}
                    onClick={() => {
                      setMacroStageList(item.stageList);
                      setBrowserTabList([{tabUrl: item.stageList[0].url}]);
                      startMacroExecute();
                      navigate("/macro");
                    }}
                  />
                ))}
              <EmptyCard />
            </div>
          )}
          {menuMode === "BOOKMARK" && (
            <div className="w-full h-full p-16 flex flex-row flex-wrap">
              {macroItemList.length > 0 &&
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
                          navigate("/macro");
                        }}
                      />
                    )
                  );
                })}
            </div>
          )}
          {menuMode === "SHORTCUT" && (
            <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-scroll">
              {macroItemList.length > 0 ? (
                macroItemList.map((item) => <ShortCutCard key={nanoid()} macroItem={item} />)
              ) : (
                <p className="text-white">매크로가 없습니다. 매크로를 등록해주세요.</p>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default MainContent;
