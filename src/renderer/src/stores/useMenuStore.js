import {create} from "zustand";

const useMenuStore = create((set) => ({
  menuMode: "HOME",
  recordMode: "auto",
  macroConfigList: new Array({}),
  directMacroName: "",
  setMenuMode: (newMode) => set({menuMode: newMode}),
  setRecordMode: (newMode) => set({recordMode: newMode}),
  setDirectMacroName: (newName) => set({directMacroName: newName}),
  addMacroConfigList: (configList) => set({macroConfigList: configList}),
}));

export default useMenuStore;
