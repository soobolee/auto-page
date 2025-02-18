import {create} from "zustand";

const useMacroStageStore = create((set) => ({
  macroStageList: [],
  macroImageList: [],
  isMacroRecordStart: false,
  isMacroStartExecute: false,
  setMacroStageList: (newStageList) => set({macroStageList: newStageList}),
  setImageStageList: (newImageList) => set({macroImageList: newImageList}),
  resetStageList: () => set({macroStageList: [], macroImageList: [], isMacroStartExecute: false}),
  startMacroExecute: () => set({isMacroStartExecute: true}),
  stopMacroExecute: () => set({isMacroStartExecute: false}),
  startMacroRecord: () => set({isMacroRecordStart: true}),
  stopMacroRecord: () => set({isMacroRecordStart: false}),
}));

export default useMacroStageStore;
