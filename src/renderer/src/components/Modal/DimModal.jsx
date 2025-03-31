import useModalStore from "../../stores/useModalStore";
import AlertModal from "./AlertModal";
import InputModal from "./InputModal";

function DimModal() {
  const {isShowInputModal, isShowAlertModal} = useModalStore();

  const handleEvent = (event) => {
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
