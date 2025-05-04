import {ModalContent} from "@renderer/types/contents";
import {ModalStore} from "@renderer/types/stores";
import {create} from "zustand";

const useModalStore = create<ModalStore>((set) => ({
  isShowInputModal: false,
  isShowAlertModal: false,
  modalContent: {} as ModalContent,
  buttonClick: null,
  openInputModal: () => set({isShowInputModal: true}),
  openAlertModal: (modalContent, buttonClick) =>
    set({
      isShowAlertModal: true,
      modalContent: modalContent,
      buttonClick: buttonClick,
    }),
  closeModal: () =>
    set({
      isShowInputModal: false,
      isShowAlertModal: false,
      modalContent: {} as ModalContent,
      buttonClick: null,
    }),
}));

export default useModalStore;
