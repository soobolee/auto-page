import {nanoid} from "nanoid";
import useMenuStore from "../../stores/useMenuStore";
import useMacroStageStore from "../../stores/useMacroStageStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faBookmark, faSquarePlus, faKeyboard} from "@fortawesome/free-solid-svg-icons";

function Navigation() {
  const {menuMode, setMenuMode} = useMenuStore();
  const {resetStageList} = useMacroStageStore();

  const navIconList = [faHome, faBookmark, faSquarePlus, faKeyboard];
  const navMenuList = ["HOME", "BOOKMARK", "ADDMACRO", "SHORTCUT"];
  const navMenuDescriptionList = ["홈", "북마크", "매크로 수정", "단축키"];

  return (
    <nav className="w-[10%] h-[100%] bg-sub border">
      <ul className="my-3 p-4 text-white text-5xl">
        {navIconList.map((icon, index) => {
          return (
            <li
              key={nanoid()}
              className={`${menuMode === navMenuList[index] ? "bg-green" : "hover:bg-subsub"} w-full h-34 my-2 flex flex-col justify-center items-center rounded-2xl`}
              onClick={() => {
                setMenuMode(navMenuList[index]);
                resetStageList();
              }}
            >
              <FontAwesomeIcon className="cursor-pointer" icon={icon} />
              <span className="text-xl mt-2">{navMenuDescriptionList[index]}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navigation;
