import {MacroStore} from "@renderer/types/stores";
import {create} from "zustand";

const useMacroStore = create<MacroStore>((set) => ({
  macroItemList: [],
  updateTargetMacroName: "",
  setMacroItemList: (newItemList) => set({macroItemList: newItemList}),
  setUpdateTargetMacroName: (updateTargetName) => set({updateTargetMacroName: updateTargetName}),

  macroStageList: [],
  macroImageList: [],
  isMacroRecording: false,
  isMacroExecuting: false,

  setMacroStageList: (newStageList) => set({macroStageList: newStageList}),
  setMacroImageList: (newImageList) => set({macroImageList: newImageList}),

  resetStageList: () =>
    set({
      macroStageList: [],
      macroImageList: [],
      isMacroRecording: false,
      isMacroExecuting: false,
    }),

  startMacroExecute: () => {
    set({isMacroExecuting: true});
    window.electronAPI.changeSession(true);
  },
  stopMacroExecute: () => {
    set({isMacroExecuting: false});
    window.electronAPI.changeSession(false);
  },

  startMacroRecord: () => set({isMacroRecording: true}),
  stopMacroRecord: () => set({isMacroRecording: false}),
}));

export default useMacroStore;
