import {create} from "zustand";

const useMacroStageStore = create((set) => ({
  macroStageList: [],
  setMacroStageList: (newStageList) => set({macroStageList: newStageList}),
}));

export default useMacroStageStore;
