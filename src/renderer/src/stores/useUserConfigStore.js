import {create} from "zustand";

const useUserConfigStore = create((set) => ({
  isShowModal: false,
  shortCutList: [],
  openModal: () => set({isShowModal: true}),
  closeModal: () => set({isShowModal: false}),
  setShortCutList: (newShortCutList) => set({shortCutList: newShortCutList}),
}));

export default useUserConfigStore;
