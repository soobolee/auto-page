import {create} from "zustand";

const useMacroStageStore = create((set) => ({
  macroStageList: [],
  macroImageList: [],
  isMacroRecording: false,
  isMacroExecuting: false,
  setMacroStageList: (newStageList) => set({macroStageList: newStageList}),
  setImageStageList: (newImageList) => set({macroImageList: newImageList}),
  resetStageList: () => set({macroStageList: [], macroImageList: [], isMacroExecuting: false}),
  toggleMacroExecute: () =>
    set((state) => ({
      isMacroExecuting: !state.isMacroExecuting,
      macroStageList: state.isMacroExecuting ? state.macroStageList : [],
    })),
  startMacroExecute: () => set({isMacroExecuting: true}),
  stopMacroExecute: () => set({isMacroExecuting: false, macroStageList: []}),
  toggleMacroRecord: () => set((state) => ({isMacroRecording: !state.isMacroRecording})),
  startMacroRecord: () => set({isMacroRecording: true}),
  stopMacroRecord: () => set({isMacroRecording: false}),
}));

export default useMacroStageStore;
