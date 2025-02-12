import {create} from "zustand";

const useTabStore = create((set) => ({
  browserTabList: [],
  tabFocusedIndex: 0,
  setBrowserTabList: (newTabList) => set({browserTabList: newTabList}),
  setTabFocusedIndex: (focusIndex) => set({tabFocusedIndex: focusIndex}),
}));

export default useTabStore;
