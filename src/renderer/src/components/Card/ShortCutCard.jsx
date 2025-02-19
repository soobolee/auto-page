import {useState} from "react";
import useUserConfigStore from "../../stores/useUserConfigStore";
import Button from "../Button/Button";

function ShortCutCard({macroItem}) {
  const {shortCutList} = useUserConfigStore();

  const macroName = Object.keys(macroItem)[0];
  const shortCutItem = shortCutList.find((item) => {
    if (item.macroName === macroName) {
      return item;
    }
  });

  const [firstKeyUnit, setFirstKeyUnit] = useState(shortCutItem ? shortCutItem.firstKeyUnit : "");
  const [secondKeyUnit, setSecondKeyUnit] = useState(shortCutItem ? shortCutItem.secondKeyUnit : "");

  const saveShortCut = () => {
    if (!firstKeyUnit && !secondKeyUnit) {
      return;
    }

    let isDuplicated = false;

    if (shortCutItem) {
      if (shortCutItem.firstKeyUnit === firstKeyUnit && shortCutItem.secondKeyUnit === secondKeyUnit) {
        isDuplicated = true;
      }
    }

    if (!isDuplicated) {
      window.electronAPI.saveShortCut({firstKeyUnit, secondKeyUnit, macroName});
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
        <Button buttonText={"저장"} buttonColor={"bg-green"} onClick={saveShortCut} />
      </div>
    </>
  );
}

export default ShortCutCard;
