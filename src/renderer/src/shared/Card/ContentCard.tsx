import {MacroItem} from "@renderer/types/macro";
import {JSX, MouseEvent, useState} from "react";

import {
  ALERT_DELETE_MACRO,
  ALERT_ERROR_DELETE,
  ALERT_ERROR_LOAD,
  ALERT_ERROR_SAVE,
  NAV_MENU,
} from "../../constants/textConstants";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useModalStore from "../../stores/modal/useModalStore";
import IconMenuCard from "./IconMenuCard";

function ContentCard({macroItem, onClick}: {macroItem: MacroItem; onClick: () => void}): JSX.Element {
  const [isBookmark, setIsBookmark] = useState(macroItem.bookmark);
  const {setMacroItemList} = useMacroStore();
  const {setMacroStageList, setMacroImageList, setUpdateTargetMacroName} = useMacroStore();
  const {openAlertModal, closeModal} = useModalStore();
  const {setMenuMode} = useMenuStore();

  const macroName = macroItem.macroName;
  const macroUrl = macroItem.stageList[0].url;
  const birthDateObject = macroItem.birthTime;
  const accessDateObject = macroItem.accessTime;

  const birthTime = `${birthDateObject.getFullYear()}-${birthDateObject.getMonth() + 1}-${birthDateObject.getDate()}`;
  const accessTime = `${accessDateObject.getFullYear()}-${accessDateObject.getMonth() + 1}-${accessDateObject.getDate()}`;

  const handleBookmark = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();

    if (macroItem.bookmark) {
      macroItem.bookmark = false;
    } else {
      macroItem.bookmark = true;
    }

    const saveResult = window.electronAPI.saveMacro(macroName, macroItem.bookmark, "bookmark");

    if (!saveResult) {
      openAlertModal(ALERT_ERROR_SAVE);
    }

    const bookmarkMacroList = await window.electronAPI.getMacroItemList();

    if (bookmarkMacroList) {
      setMacroItemList(bookmarkMacroList);
      setIsBookmark(macroItem.bookmark);
    } else {
      openAlertModal(ALERT_ERROR_LOAD);
    }
  };

  const handleUpdate = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    const imageList = await window.electronAPI.getMacroItem("image", macroName);
    const macroList = await window.electronAPI.getMacroItem("stageList", macroName);

    if (!imageList || !macroList) {
      openAlertModal(ALERT_ERROR_LOAD);
    }

    setUpdateTargetMacroName(macroName);
    if ("image" in imageList) {
      setMacroImageList(imageList.image);
    }
    if ("stageList" in macroList) {
      setMacroStageList(macroList.stageList);
    }
    setMenuMode(NAV_MENU.ADDMACRO);
  };

  const handleDelete = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();

    const macroDelete = async () => {
      const deletedMacroList = await window.electronAPI.deleteMacroAndImage(macroItem.macroName, true);

      if (!deletedMacroList) {
        openAlertModal(ALERT_ERROR_DELETE);
      }
      if (Array.isArray(deletedMacroList)) {
        setMacroItemList(deletedMacroList);
        closeModal();
      }
    };

    openAlertModal(ALERT_DELETE_MACRO, macroDelete);
  };

  return (
    <div className="group relative w-95 h-48 m-5 p-3 bg-white rounded-2xl">
      <div className="h-full w-full flex flex-col">
        <IconMenuCard
          isBookmark={isBookmark}
          handleBookmark={handleBookmark}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
        <div className="relative">
          <p className="text-3xl mb-3">{macroName}</p>
          <p className="overflow-x-auto whitespace-nowrap">생성URL : {macroUrl}</p>
          <p>생성일 : {birthTime}</p>
          <p>사용일 : {accessTime}</p>
          <button
            className="absolute invisible group-hover:visible top-0 w-full h-full bg-green rounded-xl flex justify-center items-center text-white text-2xl"
            onClick={onClick}
          >
            <span>시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
