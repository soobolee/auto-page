import {MacroItem} from "@renderer/types/macro";
import {MacroStore} from "@renderer/types/stores";
import {useEffect} from "react";
import {useNavigate} from "react-router";

import {MenuMode, NAV_MENU, ROUTER_ROUTE} from "../constants/textConstants";
import useShortCutStore from "../stores/menu/useShortCutStore";
import useTabStore from "../stores/tab/useTabStore";

type SetMacroStageList = MacroStore["setMacroStageList"];
type startMacroExecute = MacroStore["startMacroExecute"];

const useShortcutHandler = (
  macroItemList: MacroItem[],
  menuMode: MenuMode,
  setMacroStageList: SetMacroStageList,
  startMacroExecute: startMacroExecute
) => {
  const {shortCutUnitList, setShortCutUnitList} = useShortCutStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    const handleShortCut = (event: KeyboardEvent): void => {
      const target = event.target;

      if (!target || !(target instanceof HTMLElement)) {
        return;
      }
      if (target.tagName === "INPUT" || menuMode === NAV_MENU.ADDMACRO) {
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

    const handleKeyup = (event: KeyboardEvent): void => {
      const target = event.target;

      if (!target || !(target instanceof HTMLElement)) {
        return;
      }
      if (target.tagName === "INPUT" || menuMode === NAV_MENU.ADDMACRO) {
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
