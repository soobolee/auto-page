import {create} from "zustand";

const useShortCutStore = create((set) => ({
  shortCutUnitList: [],
  setShortCutUnitList: (newShortCutUnit) => set({shortCutUnitList: newShortCutUnit}),
}));

export default useShortCutStore;
