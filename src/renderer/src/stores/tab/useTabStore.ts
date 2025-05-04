import {TabStore} from "@renderer/types/stores";
import {create} from "zustand";

const useTabStore = create<TabStore>((set) => ({
  browserTabList: [],
  tabFocusedIndex: 0,
  setBrowserTabList: (newTabList) => set({browserTabList: newTabList}),
  setTabFocusedIndex: (focusIndex) => set({tabFocusedIndex: focusIndex}),
  resetTabInfo: () => set({browserTabList: [], tabFocusedIndex: 0}),
}));

export default useTabStore;
