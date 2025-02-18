import {create} from "zustand";

const useMenuStore = create((set) => ({
  menuMode: "home",
  recordMode: "auto",
  setMenuMode: (newMode) => set({menuMode: newMode}),
  setRecordMode: (newMode) => set({recordMode: newMode}),
}));

export default useMenuStore;
