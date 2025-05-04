import {ShortCutStore} from "@renderer/types/stores";
import {create} from "zustand";

const useShortCutStore = create<ShortCutStore>((set) => ({
  shortCutUnitList: [],
  setShortCutUnitList: (newShortCutUnit) => set({shortCutUnitList: newShortCutUnit}),
}));

export default useShortCutStore;
