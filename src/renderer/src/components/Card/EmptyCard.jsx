import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router";

import {RECORD_MANUAL_START, RECORD_MODE, ROUTER_ROUTE} from "../../constants/textConstants";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMenuStore from "../../stores/useMenuStore";
import useModalStore from "../../stores/useModalStore";

function EmptyCard() {
  const navigate = useNavigate();
  const {stopMacroRecord, resetStageList} = useMacroStageStore();
  const {setRecordMode} = useMenuStore();
  const {openAlertModal, closeModal} = useModalStore();

  const handlePlusClick = (path) => {
    navigate(path);
  };

  const handleManualClick = () => {
    const clickManualStart = () => {
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
