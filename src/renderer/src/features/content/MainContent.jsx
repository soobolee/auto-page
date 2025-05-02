import {useEffect} from "react";
import {useNavigate} from "react-router";

import {ALERT_ERROR_LOAD, ALERT_ERROR_SAVE, MENU_TITLE, NAV_MENU, ROUTER_ROUTE} from "../../constants/textConstants";
import Navigation from "../../layout/Navigation/Navigation";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useShortCutStore from "../../stores/menu/useShortCutStore";
import useModalStore from "../../stores/modal/useModalStore";
import useTabStore from "../../stores/tab/useTabStore";
import BookmarkList from "../List/BookmarkList";
import MacroList from "../List/MacroList";
import MacroUpdateList from "../List/MacroUpdateList";
import ShortcutList from "../List/ShortcutList";

function MainContent() {
  const {menuMode} = useMenuStore();
  const {
    macroStageList,
    startMacroExecute,
    setMacroStageList,
    setMacroImageList,
    updateTargetMacroName,
    setUpdateTargetMacroName,
  } = useMacroStore();
  const {shortCutUnitList, setShortCutUnitList} = useShortCutStore();
  const {macroItemList, setMacroItemList} = useMacroStore();
  const {openAlertModal} = useModalStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    async function getMacroItemList() {
      const macroInfoList = await window.electronAPI.getMacroItemList();

      if (!macroInfoList) {
        openAlertModal(ALERT_ERROR_LOAD);
      }

      setMacroItemList(macroInfoList);
    }

    getMacroItemList();
  }, [setMacroItemList, openAlertModal]);

  useEffect(() => {
    const handleShortCut = (event) => {
      if (event.target.tagName === "INPUT" || menuMode === NAV_MENU.ADDMACRO) {
        return;
      }

      setShortCutUnitList([...shortCutUnitList, event.key]);

      if (shortCutUnitList.length === 1) {
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

  const handleUpdateSelect = async (event) => {
    setUpdateTargetMacroName(event.target.value);
    const savedImageList = await window.electronAPI.getMacroItem("image", event.target.value);
    const savedMacroList = await window.electronAPI.getMacroItem("stageList", event.target.value);

    if (!savedImageList || !savedMacroList) {
      openAlertModal(ALERT_ERROR_SAVE);
    }

    setMacroImageList(savedImageList.image);
    setMacroStageList(savedMacroList.stageList);
  };

  return (
    <div className="flex h-[90%]">
      <Navigation />
      <article className="w-full h-full flex justify-center items-center">
        <div className="w-[90%] h-[90%] bg-sub rounded-xl flex justify-center items-center flex-col">
          <p className="mt-12 text-3xl text-white">{MENU_TITLE[menuMode]}</p>
          {menuMode === NAV_MENU.HOME && <MacroList macroItemList={macroItemList} />}
          {menuMode === NAV_MENU.BOOKMARK && <BookmarkList macroItemList={macroItemList} />}
          {menuMode === NAV_MENU.ADDMACRO && (
            <MacroUpdateList
              macroStageList={macroStageList}
              updateTargetMacroName={updateTargetMacroName}
              handleUpdateSelect={handleUpdateSelect}
              macroItemList={macroItemList}
            />
          )}
          {menuMode === NAV_MENU.SHORTCUT && <ShortcutList macroItemList={macroItemList} />}
        </div>
      </article>
    </div>
  );
}

export default MainContent;
