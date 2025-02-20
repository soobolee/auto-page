import {useState} from "react";
import useMacroItemStore from "../../stores/useMacroItemStore";
import useMenuStore from "../../stores/useMenuStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookBookmark, faGear, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

function ContentCard({macroItem, onClick}) {
  const [isBookmark, setIsBookmark] = useState(macroItem.bookmark);
  const {setMacroItemList} = useMacroItemStore();
  const {setMenuMode} = useMenuStore();

  const macroName = macroItem.macroName;
  const macroUrl = macroItem.stageList[0].url;
  const birthDateObject = macroItem.birthTime;
  const accessDateObject = macroItem.accessTime;
  const birthTime = `${birthDateObject.getFullYear()}-${birthDateObject.getMonth() + 1}-${birthDateObject.getDate()}`;
  const accessTime = `${accessDateObject.getFullYear()}-${accessDateObject.getMonth() + 1}-${accessDateObject.getDate()}`;

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

  const handleUpdate = (event) => {
    event.stopPropagation();

    setMenuMode("ADDMACRO");
  };

  const handleDelete = async (event) => {
    event.stopPropagation();

    const deletedMacroList = await window.electronAPI.deleteMacroAndImage(macroItem.macroName);
    setMacroItemList(deletedMacroList);
  };

  return (
    <div className="bg-white w-80 h-48 rounded-2xl m-5 p-3" onClick={onClick}>
      <div className="h-full w-full flex flex-col">
        <div className="h-[60%] w-full">
          <div>
            <p className={`${isBookmark && "text-red"} my-4 mx-2 text-xl cursor-pointer inline`} onClick={handleBookmark}>
              <FontAwesomeIcon icon={faBookBookmark} />
            </p>
            <p className="my-4 mx-2 text-xl cursor-pointer inline" onClick={handleUpdate}>
              <FontAwesomeIcon icon={faGear} />
            </p>
            <p className="my-4 mx-2 text-xl cursor-pointer inline" onClick={handleDelete}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </p>
          </div>

          <p className="text-3xl m-3">{macroName}</p>
        </div>
        <p className="overflow-scroll">생성URL : {macroUrl}</p>
        <p>생성일 : {birthTime}</p>
        <p>사용일 : {accessTime}</p>
      </div>
    </div>
  );
}

export default ContentCard;
