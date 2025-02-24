import {faHome, faBookmark, faSquarePlus, faKeyboard} from "@fortawesome/free-solid-svg-icons";

export const ROUTER_ROUTE = {
  MAIN: "/",
  MACRO: "macro",
};

export const NAV_ICON = {
  HOME: faHome,
  BOOKMARK: faBookmark,
  ADDMACRO: faSquarePlus,
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

Object.freeze(ROUTER_ROUTE);
Object.freeze(NAV_ICON);
Object.freeze(NAV_MENU);
Object.freeze(NAV_DESCRIPTION);
Object.freeze(MENU_TITLE);
Object.freeze(RECORD_MODE);
