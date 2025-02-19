import {create} from "zustand";

const useMacroStageStore = create((set) => ({
  macroStageList: [],
  macroImageList: [],
  isMacroRecordStart: false,
  isMacroExecute: false,
  setMacroStageList: (newStageList) => set({macroStageList: newStageList}),
  setImageStageList: (newImageList) => set({macroImageList: newImageList}),
  resetStageList: () => set({macroStageList: [], macroImageList: [], isMacroExecute: false}),
  startMacroExecute: () => set({isMacroExecute: true}),
  stopMacroExecute: () => set({isMacroExecute: false, macroStageList: []}),
  startMacroRecord: () => set({isMacroRecordStart: true}),
  stopMacroRecord: () => set({isMacroRecordStart: false}),
}));

export default useMacroStageStore;
