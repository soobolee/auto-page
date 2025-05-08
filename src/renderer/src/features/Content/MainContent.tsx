import {ChangeEvent, useEffect} from "react";

import {ALERT_ERROR_LOAD, ALERT_ERROR_SAVE, MENU_TITLE, NAV_MENU} from "../../constants/textConstants";
import useShortcutHandler from "../../hooks/useShortcutHandler";
import Navigation from "../../layout/Navigation/Navigation";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useModalStore from "../../stores/modal/useModalStore";
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
  const {macroItemList, setMacroItemList} = useMacroStore();
  const {openAlertModal} = useModalStore();
  useShortcutHandler(macroItemList, menuMode, setMacroStageList, startMacroExecute);

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

  const handleUpdateSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    setUpdateTargetMacroName(event.target.value);
    const savedImageList = await window.electronAPI.getMacroItem("image", event.target.value);
    const savedMacroList = await window.electronAPI.getMacroItem("stageList", event.target.value);

    if (!savedImageList || !savedMacroList) {
      openAlertModal(ALERT_ERROR_SAVE);
    }
    if ("image" in savedImageList) {
      setMacroImageList(savedImageList.image);
    }

    if ("stageList" in savedMacroList) {
      setMacroStageList(savedMacroList.stageList);
    }
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
