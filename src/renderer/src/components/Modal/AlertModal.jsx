import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useModalStore from "../../stores/useModalStore";
import Button from "../Button/Button";

function AlertModal() {
  const {modalText, modalIcon, modalButtonText, modalButtonClick, closeModal} = useModalStore();

  const clickModalClose = () => {
    closeModal();
  };

  return (
    <div className="w-[60%] h-[50%] bg-white rounded-3xl border-2 flex justify-center items-center flex-col">
      <p className="text-3xl">{modalText}</p>
      <FontAwesomeIcon icon={modalIcon} />
      <div>
        <Button buttonText={modalButtonText} buttonColor={"bg-green"} onClick={modalButtonClick} />
        <Button buttonText={"닫기"} buttonColor={"bg-red"} onClick={clickModalClose} />
      </div>
    </div>
  );
}

export default AlertModal;
