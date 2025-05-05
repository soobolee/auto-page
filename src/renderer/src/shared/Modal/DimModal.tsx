import {JSX, MouseEvent} from "react";

import useModalStore from "../../stores/modal/useModalStore";
import AlertModal from "./AlertModal";
import InputModal from "./InputModal";

function DimModal(): JSX.Element {
  const {isShowInputModal, isShowAlertModal} = useModalStore();

  const handleEvent = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-sub/50 flex justify-center items-center"
      onClick={handleEvent}
    >
      {isShowAlertModal && <AlertModal />}
      {isShowInputModal && <InputModal />}
    </div>
  );
}

export default DimModal;
