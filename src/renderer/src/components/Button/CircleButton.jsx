import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function CircleButton({icon, onClick, isActive}) {
  return (
    <button className="w-8 h-8 my-1 mx-1.5 bg-sub rounded-4xl hover:bg-gray-500" onClick={onClick}>
      <FontAwesomeIcon className={isActive ? "text-white" : "text-black"} icon={icon} />
    </button>
  );
}

export default CircleButton;
