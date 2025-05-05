export interface MacroClass {
  className: string;
  classIndex?: number;
  [key: string]: unknown;
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

export interface MacroImage {
  id: string;
  data: string;
  [key: string]: unknown;
}

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
  [key: string]: unknown;
}

export type CapturePage = () => Promise<void>;
