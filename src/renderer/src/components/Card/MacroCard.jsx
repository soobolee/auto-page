import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookBookmark, faGear, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

function MacroCard() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-[60%] w-full">
        <div>
          <FontAwesomeIcon className="my-4 mx-2 text-xl" icon={faBookBookmark} />
          <FontAwesomeIcon className="my-4 mx-2 text-xl" icon={faGear} />
          <FontAwesomeIcon className="my-4 mx-2 text-xl" icon={faCircleXmark} />
        </div>

        <p className="text-3xl">네이버 로그인</p>
      </div>
      <p>생성일 </p>
      <p>사용일 </p>
    </div>
  );
}

export default MacroCard;
