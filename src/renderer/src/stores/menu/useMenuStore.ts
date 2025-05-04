import {MenuStore} from "@renderer/types/stores";
import {create} from "zustand";

import {NAV_MENU, RECORD_MODE} from "../../constants/textConstants";

const useMenuStore = create<MenuStore>((set) => ({
  menuMode: NAV_MENU.HOME,
  recordMode: RECORD_MODE.STOP,
  setMenuMode: (newMode) => set({menuMode: newMode}),
  setRecordMode: (newMode) => set({recordMode: newMode}),
}));

export default useMenuStore;
