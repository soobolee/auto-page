export type MacroContentType = "stageList" | "image";

export interface MacroStage {
  tagName?: string;
  value?: string;
  [key: string]: unknown;
}

export interface MacroImage {
  image: string;
}

export interface MacroFileData {
  stageList: MacroStage[];
  macroName?: string;
  birthTime?: Date;
  accessTime?: Date;
  [key: string]: unknown;
}
