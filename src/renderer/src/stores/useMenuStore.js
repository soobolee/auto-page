import {create} from "zustand";

const useMenuStore = create((set) => ({
  menuMode: "HOME",
  recordMode: "auto",
  macroConfigList: [""],
  setMenuMode: (newMode) => set({menuMode: newMode}),
  setRecordMode: (newMode) => set({recordMode: newMode}),
  addMacroConfigList: (configList) => set({macroConfigList: configList}),
}));

export default useMenuStore;
