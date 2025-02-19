import {useState} from "react";
import useMenuStore from "../../stores/useMenuStore";
import Button from "../Button/Button";

function ShortCutCard({macroItem}) {
  const macroName = macroItem.macroName;
  const shortCutItem = macroItem.shortCut || {};

  const [firstKeyUnit, setFirstKeyUnit] = useState(shortCutItem.firstKeyUnit);
  const [secondKeyUnit, setSecondKeyUnit] = useState(shortCutItem.secondKeyUnit);
  const [isSaveError, setIsSaveError] = useState(false);
  const {setMenuMode} = useMenuStore();

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

      if (saveResult) {
        setMenuMode("HOME");
      } else {
        setIsSaveError(true);
      }
    }
  };

  return (
    <>
      <div className="w-[75%] h-25 p-5 bg-white flex justify-between">
        <input
          type="text"
          readOnly
          className="w-30 border-2 h-full bg-tab text-3xl"
          value={firstKeyUnit}
          onKeyDown={(event) => {
            setFirstKeyUnit(event.key === "Backspace" ? "" : event.key);
          }}
        />
        <div className="flex justify-center items-center text-7xl"> + </div>
        <input
          type="text"
          readOnly
          className="w-30 border-2 h-full bg-tab text-3xl"
          value={secondKeyUnit}
          onKeyDown={(event) => {
            setSecondKeyUnit(event.key === "Backspace" ? "" : event.key);
          }}
        />
        <div className="flex justify-center items-center text-7xl"> = </div>
        <input type="text" defaultValue={macroName} className="w-70 border-2 h-full bg-tab text-3xl" />
        {!isSaveError && <Button buttonText={"저장"} buttonColor={"bg-green"} onClick={saveShortCut} />}
        {isSaveError && <Button buttonText={"재시도"} buttonColor={"bg-red"} onClick={saveShortCut} />}
      </div>
    </>
  );
}

export default ShortCutCard;
