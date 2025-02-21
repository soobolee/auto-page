import {nanoid} from "nanoid";
import useMenuStore from "../../stores/useMenuStore";
import useMacroStageStore from "../../stores/useMacroStageStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faBookmark, faSquarePlus, faKeyboard} from "@fortawesome/free-solid-svg-icons";

function Navigation() {
  const {setMenuMode} = useMenuStore();
  const {resetStageList} = useMacroStageStore();

  const navIconList = [faHome, faBookmark, faSquarePlus, faKeyboard];
  const navMenuList = ["HOME", "BOOKMARK", "ADDMACRO", "SHORTCUT"];

  return (
    <nav className="w-[10%] h-[100%] bg-sub border">
      <ul className="my-4 text-white text-5xl">
        {navIconList.map((icon, index) => {
          return (
            <li
              key={nanoid()}
              className="flex justify-center items-center w-full h-34 hover:bg-subsub"
              onClick={() => {
                setMenuMode(navMenuList[index]);
                resetStageList();
              }}
            >
              <FontAwesomeIcon className="cursor-pointer" icon={icon} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navigation;
