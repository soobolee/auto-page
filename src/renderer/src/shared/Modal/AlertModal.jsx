import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import useModalStore from "../../stores/modal/useModalStore";
import Button from "../Button/Button";

function AlertModal() {
  const {modalContent, buttonClick, closeModal} = useModalStore();

  const clickModalClose = () => {
    closeModal();
  };

  return (
    <div className="w-[60%] h-[50%] bg-white rounded-3xl border-2 flex justify-center items-center flex-col gap-6">
      <p className="text-3xl">{modalContent.TITLE}</p>
      <p className="text-lg text-gray-700">{modalContent.TEXT}</p>
      <span className="text-8xl m-5">
        <FontAwesomeIcon icon={modalContent.ICON} />
      </span>
      <div>
        {modalContent.BUTTON && (
          <Button buttonText={modalContent.BUTTON} buttonColor={"bg-green"} onClick={buttonClick} />
        )}
        <Button buttonText={"닫기"} buttonColor={"bg-red"} onClick={clickModalClose} />
      </div>
    </div>
  );
}

export default AlertModal;
