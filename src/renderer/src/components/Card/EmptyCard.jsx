import {useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";

function EmptyCard() {
  const navigate = useNavigate();

  const handlePlusClick = (path) => {
    navigate(path);
  };

  return (
    <div className="flex bg-white w-80 h-48 rounded-2xl m-5">
      <div
        className="flex justify-center items-center flex-col w-[50%] h-full hover:bg-subsub rounded-2xl cursor-pointer"
        onClick={() => {
          handlePlusClick("/macro");
        }}
      >
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>자동</p>
      </div>
      <div
        className="flex justify-center items-center flex-col w-[50%] h-full hover:bg-subsub rounded-2xl cursor-pointer"
        onClick={() => {
          handlePlusClick("/macro");
        }}
      >
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>수동</p>
      </div>
    </div>
  );
}

export default EmptyCard;
