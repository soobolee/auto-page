import {create} from "zustand";

const useMacroStageStore = create((set) => ({
  macroStageList: [],
  macroImageList: [],
  isMacroStart: false,
  setMacroStageList: (newStageList) => set({macroStageList: newStageList}),
  setImageStageList: (newImageList) => set({macroImageList: newImageList}),
  resetStageList: () => set({macroStageList: [], macroImageList: []}),
  startMacro: () => set({isMacroStart: true}),
  stopMacro: () => set({isMacroStart: false}),
}));

export default useMacroStageStore;
