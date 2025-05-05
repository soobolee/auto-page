import {ChangeEvent, JSX, useState} from "react";
import {useNavigate} from "react-router";

import {ALERT_ERROR_SAVE, RECORD_MODE, ROUTER_ROUTE} from "../../constants/textConstants";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useModalStore from "../../stores/modal/useModalStore";
import useTabStore from "../../stores/tab/useTabStore";
import Button from "../Button/Button";

function InputModal(): JSX.Element {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const {openAlertModal, closeModal} = useModalStore();
  const {resetTabInfo} = useTabStore();
  const {macroStageList, macroImageList, resetStageList, stopMacroRecord} = useMacroStore();
  const {setRecordMode} = useMenuStore();

  const clickModalSave = (): void => {
    const saveMacroResult = window.electronAPI.saveMacro(inputValue, macroStageList, "stageList");
    const saveImageResult = window.electronAPI.saveImage(inputValue, macroImageList);
    stopMacroRecord();
    closeModal();

    if (!saveMacroResult || !saveImageResult) {
      openAlertModal(ALERT_ERROR_SAVE);
    }

    setRecordMode(RECORD_MODE.STOP);
    resetStageList();
    resetTabInfo();
    navigate(ROUTER_ROUTE.MAIN);
  };

  const inputMacroName = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const clickModalClose = (): void => {
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
        <Button color="green" onClick={clickModalSave}>
          저장
        </Button>
        <Button color="red" onClick={clickModalClose}>
          취소
        </Button>
      </div>
    </div>
  );
}

export default InputModal;
