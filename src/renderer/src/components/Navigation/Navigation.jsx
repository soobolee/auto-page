import {nanoid} from "nanoid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faBookmark, faSquarePlus, faKeyboard} from "@fortawesome/free-solid-svg-icons";

function Navigation() {
  const navIconList = [faHome, faBookmark, faSquarePlus, faKeyboard];

  return (
    <nav className="w-[10%] h-[100%] bg-sub border">
      <ul className="my-4 text-white text-5xl">
        {navIconList.map((icon) => {
          return (
            <li key={nanoid()} className="flex justify-center items-center w-full h-34 hover:bg-subsub">
              <FontAwesomeIcon className="cursor-pointer" icon={icon} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navigation;
