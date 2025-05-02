import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function NavItem({icon, description, isActive, onClick}) {
  return (
    <li
      className={`${isActive ? "bg-green" : "hover:bg-subsub click-action"} w-full h-34 my-2 flex flex-col justify-center items-center rounded-2xl`}
      onClick={onClick}
    >
      <FontAwesomeIcon className="cursor-pointer" icon={icon} />
      <span className="text-xl mt-2">{description}</span>
    </li>
  );
}

export default NavItem;
