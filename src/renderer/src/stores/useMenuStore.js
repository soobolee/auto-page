import {create} from "zustand";

const useMenuStore = create((set) => ({
  recordMode: "auto",
  setRecordMode: (newMode) => set({recordMode: newMode}),
}));

export default useMenuStore;
