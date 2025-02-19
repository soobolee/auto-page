import {create} from "zustand";

const useUserConfigStore = create((set) => ({
  isShowModal: false,
  shortCutList: [],
  shortCutUnitList: [],
  openModal: () => set({isShowModal: true}),
  closeModal: () => set({isShowModal: false}),
  setShortCutList: (newShortCutList) => set({shortCutList: newShortCutList}),
  setShortCutUnitList: (newShortCutUnit) => set({shortCutUnitList: newShortCutUnit}),
}));

export default useUserConfigStore;
