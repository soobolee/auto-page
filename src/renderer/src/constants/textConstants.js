import {
  faHome,
  faBookmark,
  faGear,
  faKeyboard,
  faCamera,
  faCameraRotate,
  faTrash,
  faFileArrowDown,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export const ROUTER_ROUTE = {
  MAIN: "/",
  MACRO: "macro",
};

export const NAV_ICON = {
  HOME: faHome,
  BOOKMARK: faBookmark,
  ADDMACRO: faGear,
  SHORTCUT: faKeyboard,
};

export const NAV_MENU = {
  HOME: "HOME",
  BOOKMARK: "BOOKMARK",
  ADDMACRO: "ADDMACRO",
  SHORTCUT: "SHORTCUT",
};

export const NAV_DESCRIPTION = {
  HOME: "홈",
  BOOKMARK: "북마크",
  ADDMACRO: "매크로 수정",
  SHORTCUT: "단축키",
};

export const MENU_TITLE = {
  HOME: "매크로를 추가하고 바로 시작하세요.",
  BOOKMARK: "북마크 버튼으로 간편하게 모아보세요.",
  ADDMACRO: "매크로를 선택하고 단계 별로 수정하세요.",
  SHORTCUT: "단축키를 설정하고 빠르게 시작하세요.",
};

export const RECORD_MODE = {
  AUTO: "auto",
  MANUAL: "manual",
};

export const RECORD_AUTO_START = {
  TITLE: "매크로 자동 기록",
  TEXT: "다음 행동부터 자동으로 기록됩니다.",
  BUTTON: "시작",
  ICON: faCameraRotate,
};

export const RECORD_MANUAL_START = {
  TITLE: "매크로 수동 기록",
  TEXT: "시작 버튼을 눌러 기록할 수 있습니다. 멈추고 싶을 때는 정지버튼을 누르세요.",
  BUTTON: "시작",
  ICON: faCamera,
};

export const ALERT_DELETE_MACRO = {
  TITLE: "매크로를 삭제하시겠습니까?",
  TEXT: "삭제된 매크로는 복구할 수 없습니다.",
  BUTTON: "삭제",
  ICON: faTrash,
};

export const ALERT_DELETE_STAGE = {
  TITLE: "해당 단계를 삭제하시겠습니까?",
  TEXT: "해당 단계를 삭제 시 매크로 실행에 문제가 생길 수 있습니다.",
  BUTTON: "삭제",
  ICON: faTrash,
};

export const ALERT_SAVE_STAGE = {
  TITLE: "해당 단계를 저장하시겠습니까?",
  TEXT: "잘못된 값을 저장 시 매크로 실행에 문제가 있을 수 있습니다.",
  BUTTON: "저장",
  ICON: faFileArrowDown,
};

export const ALERT_ERROR_SAVE = {
  TITLE: "저장 중 오류가 발생했습니다.",
  TEXT: "다시 저장해 주세요.",
  ICON: faCircleExclamation,
};

export const ALERT_ERROR_DELETE = {
  TITLE: "삭제 중 오류가 발생했습니다.",
  TEXT: "다시 삭제해 주세요.",
  ICON: faCircleExclamation,
};

export const ALERT_ERROR_LOAD = {
  TITLE: "매크로를 불러오는 중 오류가 발생했습니다.",
  TEXT: "앱을 다시 실행해 주세요.",
  ICON: faCircleExclamation,
};

Object.freeze(ROUTER_ROUTE);
Object.freeze(NAV_ICON);
Object.freeze(NAV_MENU);
Object.freeze(NAV_DESCRIPTION);
Object.freeze(MENU_TITLE);
Object.freeze(RECORD_MODE);
Object.freeze(ALERT_DELETE_MACRO);
Object.freeze(ALERT_DELETE_STAGE);
Object.freeze(ALERT_SAVE_STAGE);
Object.freeze(ALERT_ERROR_SAVE);
Object.freeze(ALERT_ERROR_DELETE);
Object.freeze(ALERT_ERROR_LOAD);
