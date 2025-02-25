import {useState} from "react";
import {useNavigate} from "react-router";
import useModalStore from "../../stores/useModalStore";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useTabStore from "../../stores/useTabStore";
import Button from "../Button/Button";
import useMenuStore from "../../stores/useMenuStore";
import {ROUTER_ROUTE, RECORD_MODE, ALERT_ERROR_SAVE} from "../../constants/textConstants";

function NameModal() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const {openAlertModal, closeModal} = useModalStore();
  const {resetTabInfo} = useTabStore();
  const {macroStageList, macroImageList, resetStageList, stopMacroRecord} = useMacroStageStore();
  const {setRecordMode} = useMenuStore();

  const clickModalSave = () => {
    const saveMacroResult = window.electronAPI.saveMacro(inputValue, macroStageList, "stageList");
    const saveImageResult = window.electronAPI.saveImage(inputValue, macroImageList);
    stopMacroRecord();
    closeModal();

    if (!saveMacroResult || !saveImageResult) {
      openAlertModal(ALERT_ERROR_SAVE);
    }

    setRecordMode(RECORD_MODE.AUTO);
    resetStageList();
    resetTabInfo();
    navigate(ROUTER_ROUTE.MAIN);
  };

  const inputMacroName = (event) => {
    setInputValue(event.target.value);
  };

  const clickModalClose = () => {
    closeModal();
  };

  return (
    <div className="w-[90%] h-[80%] bg-white rounded-3xl border-2 flex justify-center items-center flex-col">
      <p className="text-3xl">기록한 매크로의 이름을 적어주세요.</p>
      <input
        type="text"
        value={inputValue}
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
