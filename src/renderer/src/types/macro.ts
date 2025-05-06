export interface MacroClass {
  className: string;
  classIndex?: number;
}

export interface MacroStage {
  id?: string;
  tagName?: string;
  tagIndex?: number;
  class?: MacroClass[];
  method?: string;
  url: string;
  href?: string;
  value?: string;
  [key: string]: unknown;
}

export type MacroImage = string;

export interface MacroItem {
  macroName: string;
  stageList: MacroStage[];
  image?: MacroImage[];
  birthTime: Date;
  accessTime: Date;
  shortCut: {
    firstKeyUnit: string;
    secondKeyUnit: string;
  };
  bookmark: boolean;
  [key: string]: unknown;
}

export type CapturePage = () => Promise<void>;
