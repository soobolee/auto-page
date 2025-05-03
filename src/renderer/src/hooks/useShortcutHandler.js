import {useEffect} from "react";
import {useNavigate} from "react-router";

import {NAV_MENU, ROUTER_ROUTE} from "../constants/textConstants";
import useShortCutStore from "../stores/menu/useShortCutStore";
import useTabStore from "../stores/tab/useTabStore";

const useShortcutHandler = (macroItemList, menuMode, setMacroStageList, startMacroExecute) => {
  const {shortCutUnitList, setShortCutUnitList} = useShortCutStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    const handleShortCut = (event) => {
      if (event.target.tagName === "INPUT" || menuMode === NAV_MENU.ADDMACRO) {
        return;
      }

      const updatedShortCutUnitList = [...shortCutUnitList, event.key];
      setShortCutUnitList(updatedShortCutUnitList);

      if (updatedShortCutUnitList.length === 2) {
        const macroInfo = macroItemList.find((macroItem) => {
          if (macroItem.shortCut) {
            return (
              macroItem.shortCut.firstKeyUnit === shortCutUnitList[0] && macroItem.shortCut.secondKeyUnit === event.key
            );
          }
        });

        if (!macroInfo) {
          return;
        }

        setMacroStageList(macroInfo.stageList);
        setBrowserTabList([{tabUrl: macroInfo.stageList[0].url}]);
        startMacroExecute();
        navigate(ROUTER_ROUTE.MACRO);
      }
    };

    const handleKeyup = (event) => {
      if (event.target.tagName === "INPUT" || menuMode === NAV_MENU.ADDMACRO) {
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
    shortCutUnitList,
    startMacroExecute,
  ]);
};

export default useShortcutHandler;
