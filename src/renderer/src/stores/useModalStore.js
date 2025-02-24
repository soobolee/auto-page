import {create} from "zustand";

const useModalStore = create((set) => ({
  isShowInputModal: false,
  isShowAlertModal: false,
  modalText: "",
  modalIcon: null,
  modalButtonText: "",
  modalButtonClick: null,
  openInputModal: () => set({isShowInputModal: true}),
  openAlertModal: () => set({isShowAlertModal: true}),
  closeModal: () => set({isShowInputModal: false, isShowAlertModal: false}),
}));

export default useModalStore;
