import {create} from "zustand";

const useUserConfigStore = create((set) => ({
  isShowModal: false,
  openModal: () => set({isShowModal: true}),
  closeModal: () => set({isShowModal: false}),
}));

export default useUserConfigStore;
