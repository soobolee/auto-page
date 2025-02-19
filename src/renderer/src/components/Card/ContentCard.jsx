import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookBookmark, faGear, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

function ContentCard({macroItem, onClick}) {
  const [isBookmark, setIsBookmark] = useState(macroItem.bookmark);
  const macroName = macroItem.macroName;
  const macroUrl = macroItem.stageList[0].url;

  const handleBookmark = (event) => {
    event.stopPropagation();

    if (macroItem.bookmark) {
      macroItem.bookmark = false;
    } else {
      macroItem.bookmark = true;
    }

    window.electronAPI.saveMacro(macroName, macroItem.bookmark, "bookmark");
    setIsBookmark(macroItem.bookmark);
  };

  return (
    <div className="bg-white w-80 h-48 rounded-2xl m-5 p-3" onClick={onClick}>
      <div className="h-full w-full flex flex-col">
        <div className="h-[60%] w-full">
          <div>
            <p className={`${isBookmark && "text-red"} my-4 mx-2 text-xl cursor-pointer inline`} onClick={handleBookmark}>
              <FontAwesomeIcon icon={faBookBookmark} />
            </p>
            <p className="my-4 mx-2 text-xl cursor-pointer inline">
              <FontAwesomeIcon icon={faGear} />
            </p>
            <p className="my-4 mx-2 text-xl cursor-pointer inline">
              <FontAwesomeIcon icon={faCircleXmark} />
            </p>
          </div>

          <p className="text-3xl m-3">{macroName}</p>
        </div>
        <p>생성URL : {macroUrl}</p>
      </div>
    </div>
  );
}

export default ContentCard;
