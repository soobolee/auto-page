import {useNavigate} from "react-router";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMenuStore from "../../stores/useMenuStore";
import useModalStore from "../../stores/useModalStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {ROUTER_ROUTE, RECORD_MODE, RECORD_AUTO_START, RECORD_MANUAL_START} from "../../constants/textConstants";

function EmptyCard() {
  const navigate = useNavigate();
  const {startMacroRecord, stopMacroRecord, resetStageList} = useMacroStageStore();
  const {setRecordMode} = useMenuStore();
  const {openAlertModal, closeModal} = useModalStore();

  const handlePlusClick = (path) => {
    navigate(path);
  };

  const handleAutoClick = () => {
    const clickAutoStart = () => {
      resetStageList();
      handlePlusClick(ROUTER_ROUTE.MACRO);
      startMacroRecord();
      setRecordMode(RECORD_MODE.AUTO);

      closeModal();
    };

    openAlertModal(RECORD_AUTO_START, clickAutoStart);
  };

  const handleManualClick = () => {
    const clickManualStart = () => {
      resetStageList();
      handlePlusClick(ROUTER_ROUTE.MACRO);
      stopMacroRecord();
      setRecordMode(RECORD_MODE.MANUAL);

      closeModal();
    };

    openAlertModal(RECORD_MANUAL_START, clickManualStart);
  };

  return (
    <div className="flex bg-white w-95 h-48 rounded-2xl m-5">
      <div className="flex justify-center items-center flex-col w-[50%] rounded-2xl cursor-pointer hover-small" onClick={handleAutoClick}>
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>자동</p>
      </div>
      <div className="flex justify-center items-center flex-col w-[50%] rounded-2xl cursor-pointer hover-small" onClick={handleManualClick}>
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>수동</p>
      </div>
    </div>
  );
}

export default EmptyCard;
