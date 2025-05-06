import {nanoid} from "nanoid";

import {NAV_DESCRIPTION, NAV_ICON, NAV_MENU} from "../../constants/textConstants";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import NavItem from "./NavItem";

function Navigation() {
  const {menuMode, setMenuMode} = useMenuStore();
  const {resetStageList} = useMacroStore();
  const navIconKeyList = Object.keys(NAV_ICON) as (keyof typeof NAV_ICON)[];

  return (
    <nav className="w-[10%] h-[100%] bg-sub border overflow-y-auto">
      <ul className="my-3 p-4 text-white text-5xl">
        {navIconKeyList.map((key) => (
          <NavItem
            key={nanoid()}
            icon={NAV_ICON[key]}
            description={NAV_DESCRIPTION[key]}
            isActive={menuMode === NAV_MENU[key]}
            onClick={() => {
              setMenuMode(NAV_MENU[key]);
              resetStageList();
            }}
          />
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
