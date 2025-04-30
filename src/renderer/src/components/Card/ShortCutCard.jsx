import {useState} from "react";

import {ALERT_DUPLICATED_URL, NAV_MENU} from "../../constants/textConstants";
import useMacroItemStore from "../../stores/useMacroItemStore";
import useMenuStore from "../../stores/useMenuStore";
import useModalStore from "../../stores/useModalStore";
import Button from "../Button/Button";

function ShortCutCard({macroItem}) {
  const macroName = macroItem.macroName;
  const shortCutItem = macroItem.shortCut || {};

  const [firstKeyUnit, setFirstKeyUnit] = useState(shortCutItem.firstKeyUnit);
  const [secondKeyUnit, setSecondKeyUnit] = useState(shortCutItem.secondKeyUnit);
  const [isSaveError, setIsSaveError] = useState(false);
  const {setMenuMode} = useMenuStore();
  const {openAlertModal} = useModalStore();
  const {setMacroItemList} = useMacroItemStore();

  const saveShortCut = async () => {
    if (!firstKeyUnit && !secondKeyUnit) {
      return;
    }

    let isDuplicated = false;

    if (Object.keys(shortCutItem).length) {
      if (shortCutItem.firstKeyUnit === firstKeyUnit && shortCutItem.secondKeyUnit === secondKeyUnit) {
        isDuplicated = true;
      }
    }

    if (!isDuplicated) {
      const saveResult = await window.electronAPI.saveMacro(macroName, {firstKeyUnit, secondKeyUnit}, "shortCut");
      const macroItemList = await window.electronAPI.getMacroItemList();

      if (saveResult) {
        setMacroItemList(macroItemList);
        setMenuMode(NAV_MENU.HOME);
      } else {
        setIsSaveError(true);
      }
    } else {
      openAlertModal(ALERT_DUPLICATED_URL);
    }
  };

  return (
    <>
      <div className="w-[75%] h-25 p-5 bg-white flex justify-between rounded-2xl">
        <input
          type="text"
          readOnly
          className="w-30 border-2 h-full text-center bg-gray-400 text-3xl rounded-2xl"
          value={firstKeyUnit}
          onKeyDown={(event) => {
            setFirstKeyUnit(event.key === "Backspace" ? "" : event.key);
          }}
        />
        <div className="flex justify-center items-center text-7xl"> + </div>
        <input
          type="text"
          readOnly
          className="w-30 border-2 h-full text-center bg-gray-400 text-3xl rounded-2xl"
          value={secondKeyUnit}
          onKeyDown={(event) => {
            setSecondKeyUnit(event.key === "Backspace" ? "" : event.key);
          }}
        />
        <div className="flex justify-center items-center text-7xl"> = </div>
        <input type="text" defaultValue={macroName} className="w-70 border-2 h-full p-3 bg-tab text-3xl rounded-2xl" />
        {!isSaveError && <Button buttonText={"저장"} buttonColor={"bg-green"} onClick={saveShortCut} />}
        {isSaveError && <Button buttonText={"재시도"} buttonColor={"bg-red"} onClick={saveShortCut} />}
      </div>
    </>
  );
}

export default ShortCutCard;
