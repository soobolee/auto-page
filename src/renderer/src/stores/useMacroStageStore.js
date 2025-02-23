import {create} from "zustand";

const useMacroStageStore = create((set) => ({
  macroStageList: [],
  macroImageList: [],
  isMacroRecording: false,
  isMacroExecuting: false,
  updateTargetMacroName: "",
  setMacroStageList: (newStageList) => set({macroStageList: newStageList}),
  setImageStageList: (newImageList) => set({macroImageList: newImageList}),
  resetStageList: () => set({macroStageList: [], macroImageList: [], isMacroRecording: false, isMacroExecuting: false}),
  startMacroExecute: () => set({isMacroExecuting: true}),
  stopMacroExecute: () => set({isMacroExecuting: false, macroStageList: []}),
  startMacroRecord: () => set({isMacroRecording: true}),
  stopMacroRecord: () => set({isMacroRecording: false}),
  setUpdateTargetMacroName: (updateTargetName) => set({updateTargetMacroName: updateTargetName}),
}));

export default useMacroStageStore;
