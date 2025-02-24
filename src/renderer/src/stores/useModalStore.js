import {create} from "zustand";

const useModalStore = create((set) => ({
  isShowInputModal: false,
  isShowAlertModal: false,
  modalContent: {},
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
      modalContent: {},
      buttonClick: null,
    }),
}));

export default useModalStore;
