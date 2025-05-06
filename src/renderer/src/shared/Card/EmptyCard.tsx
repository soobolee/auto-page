import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {JSX} from "react";
import {useNavigate} from "react-router";

import {RECORD_MANUAL_START, RECORD_MODE, ROUTER_ROUTE} from "../../constants/textConstants";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useModalStore from "../../stores/modal/useModalStore";

function EmptyCard(): JSX.Element {
  const navigate = useNavigate();
  const {stopMacroRecord, resetStageList} = useMacroStore();
  const {setRecordMode} = useMenuStore();
  const {openAlertModal, closeModal} = useModalStore();

  const handlePlusClick = (path: string): void => {
    navigate(path);
  };

  const handleManualClick = (): void => {
    const clickManualStart = (): void => {
      resetStageList();
      handlePlusClick(ROUTER_ROUTE.MACRO);
      stopMacroRecord();
      setRecordMode(RECORD_MODE.START);

      closeModal();
    };

    openAlertModal(RECORD_MANUAL_START, clickManualStart);
  };

  return (
    <div className="flex bg-white w-95 h-48 rounded-2xl m-5">
      <div
        className="flex justify-center items-center flex-col w-full rounded-2xl cursor-pointer hover-small"
        onClick={handleManualClick}
      >
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>기록하러 가기</p>
      </div>
    </div>
  );
}

export default EmptyCard;
