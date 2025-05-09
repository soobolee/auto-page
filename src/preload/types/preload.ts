export interface WebviewSize {
  width: number;
  height: number;
}

export interface MacroStage {
  id?: string;
  class?: Array<{className: string; classIndex: number}>;
  tagName?: string;
  tagIndex?: number;
  url?: string;
  href?: string;
  method: "CLICK" | "CHANGE" | "KEYDOWN";
  value?: string;
}

export interface EventTargetInfo {
  id: string;
  tagName: string;
  tagIndex: number;
  class: Array<{className: string; classIndex: number}>;
  url: string;
  href?: string;
  method: string;
  value?: string;
}
