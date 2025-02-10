import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";

function EmptyCard() {
  return (
    <div className="flex bg-white w-84 h-48 rounded-2xl m-5">
      <div className="flex justify-center items-center flex-col w-[50%] h-full hover:bg-subsub rounded-2xl">
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>자동</p>
      </div>
      <div className="flex justify-center items-center flex-col w-[50%] h-full hover:bg-subsub rounded-2xl">
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>수동</p>
      </div>
    </div>
  );
}

export default EmptyCard;
