import {MacroImage, MacroStage} from "./macro";

declare global {
  interface Window {
    electronAPI: {
      changeSession: (flag: boolean) => void;
      saveMacro: (fileName: string, fileContent: MacroStage[], contentType: string) => boolean;
      saveImage: (fileName: string, fileContent: MacroImage[]) => boolean;
    };
  }
}

export {};
