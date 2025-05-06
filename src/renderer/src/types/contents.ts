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
