import {MenuMode, RecordMode} from "../constants/textConstants";
import {ModalContent} from "./contents";
import {MacroImage, MacroItem, MacroStage} from "./macro";

export interface MenuStore {
  menuMode: MenuMode;
  recordMode: RecordMode;
  setMenuMode: (newMode: MenuMode) => void;
  setRecordMode: (newMode: RecordMode) => void;
}

export interface MacroStore {
  macroItemList: MacroItem[];
  updateTargetMacroName: string;
  setMacroItemList: (list: MacroItem[]) => void;
  setUpdateTargetMacroName: (name: string) => void;

  macroStageList: MacroStage[];
  macroImageList: MacroImage[];
  isMacroRecording: boolean;
  isMacroExecuting: boolean;
  setMacroStageList: (list: MacroStage[]) => void;
  setMacroImageList: (list: MacroImage[]) => void;
  resetStageList: () => void;

  startMacroExecute: () => void;
  stopMacroExecute: () => void;
  startMacroRecord: () => void;
  stopMacroRecord: () => void;
}

export interface ModalStore {
  isShowInputModal: boolean;
  isShowAlertModal: boolean;
  modalContent: ModalContent;
  buttonClick?: () => void;
  openInputModal: () => void;
  openAlertModal: (content: ModalContent, callback?: () => void) => void;
  closeModal: () => void;
}

export interface TabStore {
  browserTabList: Record<string, unknown>[];
  tabFocusedIndex: number;
  setBrowserTabList: (list: Record<string, unknown>[]) => void;
  setTabFocusedIndex: (index: number) => void;
  resetTabInfo: () => void;
}

export interface ShortCutStore {
  shortCutUnitList: string[];
  setShortCutUnitList: (list: string[]) => void;
}
