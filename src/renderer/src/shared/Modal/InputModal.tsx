import {ChangeEvent, JSX, memo, useCallback, useState} from "react";
import {useNavigate} from "react-router";

import {ALERT_ERROR_SAVE, RECORD_MODE, ROUTER_ROUTE} from "../../constants/textConstants";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useModalStore from "../../stores/modal/useModalStore";
import useTabStore from "../../stores/tab/useTabStore";
import Button from "../Button/Button";

const InputModal = memo(function InputModal(): JSX.Element {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const {openAlertModal, closeModal} = useModalStore();
  const {resetTabInfo} = useTabStore();
  const {macroStageList, macroImageList, resetStageList, stopMacroRecord} = useMacroStore();
  const {setRecordMode} = useMenuStore();

  const clickModalSave = useCallback((): void => {
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
  }, [
    inputValue,
    macroStageList,
    macroImageList,
    stopMacroRecord,
    closeModal,
    openAlertModal,
    setRecordMode,
    resetStageList,
    resetTabInfo,
    navigate,
  ]);

  const inputMacroName = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  }, []);

  const clickModalClose = useCallback((): void => {
    closeModal();
  }, [closeModal]);

  return (
    <div className="w-[60%] h-[50%] bg-white rounded-3xl border-2 flex justify-center items-center flex-col gap-6">
      <p className="text-3xl">매크로 이름을 입력해주세요</p>
      <input
        type="text"
        className="w-[80%] h-14 text-2xl border-2 rounded-xl p-2"
        value={inputValue}
        onChange={inputMacroName}
      />
      <div>
        <Button color="green" onClick={clickModalSave}>
          저장
        </Button>
        <Button color="red" onClick={clickModalClose}>
          닫기
        </Button>
      </div>
    </div>
  );
});

export default InputModal;
