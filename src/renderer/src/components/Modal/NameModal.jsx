import {useState} from "react";
import {useNavigate} from "react-router";
import useUserConfigStore from "../../stores/useUserConfigStore";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useTabStore from "../../stores/useTabStore";
import Button from "../Button/Button";
import useMenuStore from "../../stores/useMenuStore";

function NameModal() {
  const navigate = useNavigate();
  const [macroName, setMacroName] = useState("");
  const {closeModal} = useUserConfigStore();
  const {resetTabInfo} = useTabStore();
  const {macroStageList, macroImageList, resetStageList, stopMacroRecord} = useMacroStageStore();
  const {recordMode, setRecordMode} = useMenuStore();

  const clickModalSave = () => {
    window.electronAPI.saveMacro(macroName, macroStageList, "stageList");
    window.electronAPI.saveImage(macroName, macroImageList);
    stopMacroRecord();
    resetStageList();
    closeModal();

    if (recordMode === "auto") {
      resetTabInfo();
      navigate("/");
    } else {
      resetTabInfo();
      setRecordMode("auto");
      navigate("/");
    }
  };

  const inputMacroName = (event) => {
    setMacroName(event.target.value);
  };

  const clickModalClose = () => {
    closeModal();
  };

  return (
    <div className="w-[90%] h-[80%] bg-white rounded-3xl border-2 flex justify-center items-center flex-col">
      <p className="text-3xl">기록한 매크로의 이름을 적어주세요.</p>
      <input
        type="text"
        value={macroName}
        onChange={inputMacroName}
        className="w-[40%] h-16 p-2 m-20 border-3 rounded-3xl"
        placeholder="기억하기 쉬운 이름을 적어 주면 좋아요"
      />
      <div>
        <Button buttonText={"저장"} buttonColor={"bg-green"} onClick={clickModalSave} />
        <Button buttonText={"취소"} buttonColor={"bg-red"} onClick={clickModalClose} />
      </div>
    </div>
  );
}

export default NameModal;
