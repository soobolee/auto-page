import {IconDefinition} from "@fortawesome/fontawesome-common-types";

export interface ModalContent {
  TITLE: string;
  TEXT: string;
  ICON: IconDefinition;
  BUTTON?: string;
}

export interface ShortCut {
  firstKeyUnit: string;
  secondKeyUnit: string;
}

export interface TabItem {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  goReload: () => void;
  tabUrl: string;
  title: string;
  [key: string]: unknown;
}
