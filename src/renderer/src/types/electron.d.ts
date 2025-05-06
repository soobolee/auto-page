import {ShortCut} from "./contents";
import {MacroImage, MacroItem, MacroStage} from "./macro";

declare global {
  interface Window {
    electronAPI: {
      changeSession: (flag: boolean) => void;
      saveMacro: (
        fileName: string,
        fileContent: MacroStage[] | ShortCut | boolean,
        contentType: "stageList" | "shortCut" | "bookmark"
      ) => boolean;
      saveImage: (fileName: string, fileContent: MacroImage[]) => boolean;
      getMacroItemList: () => Promise<MacroItem[]>;
      getMacroItem: (
        type: "image" | "stageList" | "shortCut",
        macroName: string
      ) => Promise<{image: MacroImage[]} | {stageList: MacroStage[]} | {shortCut: ShortCut}>;
      deleteMacroAndImage: (macroName: string, flag: boolean) => Promise<boolean | MacroItem[]>;
      capturePage: (webviewSize: string) => string | null;
    };
  }
}

export {};
