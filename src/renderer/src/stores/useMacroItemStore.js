import {create} from "zustand";

const useMacroItemStore = create((set) => ({
  macroItemList: [],
  setMacroItemList: (newItemList) => set({macroItemList: newItemList}),
}));

export default useMacroItemStore;
