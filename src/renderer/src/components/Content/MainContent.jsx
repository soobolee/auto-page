import {useEffect, useState} from "react";
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
import {nanoid} from "nanoid";

function MainContent() {
  const {menuMode} = useMenuStore();
  const {setMacroStageList, startMacroExecute} = useMacroStageStore();
  const {shortCutList, shortCutUnitList, setShortCutList, setShortCutUnitList} = useUserConfigStore();
  const {macroItemList, setMacroItemList} = useMacroItemStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    async function getMacroItem() {
      const macroItemList = await window.electronAPI.getMacroItem();
      const shortCutInfoList = await window.electronAPI.getShortCutList();

      const parseMacroItemList = macroItemList.map((macroItem) => {
        const macroName = Object.keys(macroItem)[0];

        return {[macroName]: JSON.parse(macroItem[macroName])};
      });

      let parseShortCutInfoList = [];
      if (shortCutInfoList.length > 0) {
        parseShortCutInfoList = JSON.parse(shortCutInfoList);
      }

      setMacroItemList(parseMacroItemList);
      setShortCutList(parseShortCutInfoList);
    }

    getMacroItem();
  }, [setMacroItemList, setShortCutList]);

  useEffect(() => {
    const handleShortCut = (event) => {
      if (event.target.tagName === "INPUT") {
        return;
      }

      setShortCutUnitList([...shortCutUnitList, event.key]);

      if (shortCutUnitList.length === 1) {
        const macroInfo = shortCutList.find((shortCut) => shortCut.firstKeyUnit === shortCutUnitList[0] && shortCut.secondKeyUnit === event.key);

        if (!macroInfo) {
          return;
        }

        const macroName = macroInfo.macroName;
        const macroList = macroItemList.find((macroItem) => Object.keys(macroItem)[0] === macroName)[macroName];

        setMacroStageList(macroList);
        setBrowserTabList([{tabUrl: macroList[0].url}]);
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
          {menuMode === "home" && (
            <div className="w-full h-full p-16 flex flex-row flex-wrap">
              {macroItemList.length > 0 &&
                macroItemList.map((item) => (
                  <ContentCard
                    key={nanoid()}
                    macroItem={item}
                    onClick={() => {
                      const macroList = Object.values(item)[0];
                      setMacroStageList(macroList);
                      setBrowserTabList([{tabUrl: macroList[0].url}]);
                      startMacroExecute();
                      navigate("/macro");
                    }}
                  />
                ))}
              <EmptyCard />
            </div>
          )}
          {menuMode === "shortcut" && (
            <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-scroll">
              {macroItemList && macroItemList.map((item) => <ShortCutCard key={nanoid()} macroItem={item} />)}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default MainContent;
