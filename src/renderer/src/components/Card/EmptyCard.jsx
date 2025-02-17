import {useNavigate} from "react-router";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMenuStore from "../../stores/useMenuStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";

function EmptyCard() {
  const navigate = useNavigate();
  const {startMacroRecord} = useMacroStageStore();
  const {setRecordMode} = useMenuStore();

  const handlePlusClick = (path) => {
    startMacroRecord();
    navigate(path);
  };

  return (
    <div className="flex bg-white w-80 h-48 rounded-2xl m-5">
      <div
        className="flex justify-center items-center flex-col w-[50%] h-full hover:bg-subsub rounded-2xl cursor-pointer"
        onClick={() => {
          handlePlusClick("/macro");
          setRecordMode("auto");
        }}
      >
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>자동</p>
      </div>
      <div
        className="flex justify-center items-center flex-col w-[50%] h-full hover:bg-subsub rounded-2xl cursor-pointer"
        onClick={() => {
          handlePlusClick("/macro");
          setRecordMode("manual");
        }}
      >
        <FontAwesomeIcon className="text-main text-5xl mb-5" icon={faCirclePlus} />
        <p>수동</p>
      </div>
    </div>
  );
}

export default EmptyCard;
