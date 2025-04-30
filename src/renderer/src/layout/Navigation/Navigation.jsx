import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {nanoid} from "nanoid";

import {NAV_DESCRIPTION, NAV_ICON, NAV_MENU} from "../../constants/textConstants";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";

function Navigation() {
  const {menuMode, setMenuMode} = useMenuStore();
  const {resetStageList} = useMacroStore();
  const navIconKeyList = Object.keys(NAV_ICON);

  return (
    <nav className="w-[10%] h-[100%] bg-sub border overflow-y-auto">
      <ul className="my-3 p-4 text-white text-5xl">
        {navIconKeyList.map((key) => {
          return (
            <li
              key={nanoid()}
              className={`${menuMode === NAV_MENU[key] ? "bg-green" : "hover:bg-subsub click-action"} w-full h-34 my-2 flex flex-col justify-center items-center rounded-2xl`}
              onClick={() => {
                setMenuMode(NAV_MENU[key]);
                resetStageList();
              }}
            >
              <FontAwesomeIcon className="cursor-pointer" icon={NAV_ICON[key]} />
              <span className="text-xl mt-2">{NAV_DESCRIPTION[key]}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navigation;
