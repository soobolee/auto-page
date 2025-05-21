import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {JSX, memo, useCallback} from "react";

import useModalStore from "../../stores/modal/useModalStore";
import Button from "../Button/Button";

const AlertModal = memo(function AlertModal(): JSX.Element {
  const {modalContent, buttonClick, closeModal} = useModalStore();

  const clickModalClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <div className="w-[60%] h-[50%] bg-white rounded-3xl border-2 flex justify-center items-center flex-col gap-6">
      <p className="text-3xl">{modalContent.TITLE}</p>
      <p className="text-lg text-gray-700">{modalContent.TEXT}</p>
      <span className="text-8xl m-5">
        <FontAwesomeIcon icon={modalContent.ICON} />
      </span>
      <div>
        {modalContent.BUTTON && (
          <Button color="green" onClick={buttonClick}>
            {modalContent.BUTTON}
          </Button>
        )}
        <Button color="red" onClick={clickModalClose}>
          닫기
        </Button>
      </div>
    </div>
  );
});

export default AlertModal;
