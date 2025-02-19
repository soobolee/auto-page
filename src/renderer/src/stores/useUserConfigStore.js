import {create} from "zustand";

const useUserConfigStore = create((set) => ({
  isShowModal: false,
  shortCutUnitList: [],
  toggleModal: () => set((state) => ({isShowModal: !state.isShowModal})),
  openModal: () => set({isShowModal: true}),
  closeModal: () => set({isShowModal: false}),
  setShortCutUnitList: (newShortCutUnit) => set({shortCutUnitList: newShortCutUnit}),
}));

export default useUserConfigStore;
