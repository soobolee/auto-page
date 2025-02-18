import {useState} from "react";
import Button from "../Button/Button";

function ShortCutCard({macroItem}) {
  const macroName = Object.keys(macroItem)[0];

  const [firstKeyUnit, setFirstKeyUnit] = useState("");
  const [secondKeyUnit, setSecondKeyUnit] = useState("");

  return (
    <>
      <div className="w-[75%] h-25 p-5 bg-white flex justify-between">
        <input
          type="text"
          className="w-30 border-2 h-full bg-tab text-3xl"
          value={firstKeyUnit}
          onKeyDown={(event) => {
            if (firstKeyUnit === "" && secondKeyUnit !== event.key) {
              setFirstKeyUnit(event.key);
            }
            if (event.key === "Backspace") {
              setFirstKeyUnit("");
            }
          }}
        />
        <div className="flex justify-center items-center text-7xl"> + </div>
        <input
          type="text"
          className="w-30 border-2 h-full bg-tab text-3xl"
          value={secondKeyUnit}
          onKeyDown={(event) => {
            if (secondKeyUnit === "" && firstKeyUnit !== event.key) {
              setSecondKeyUnit(event.key);
            }
            if (event.key === "Backspace") {
              setSecondKeyUnit("");
            }
          }}
        />
        <div className="flex justify-center items-center text-7xl"> = </div>
        <div className="w-70 border-2 h-full bg-tab text-3xl">{macroName}</div>
        <Button buttonText={"저장"} buttonColor={"bg-green"} />
      </div>
    </>
  );
}

export default ShortCutCard;
