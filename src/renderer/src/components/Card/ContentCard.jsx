import {useState} from "react";
import useMacroItemStore from "../../stores/useMacroItemStore";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMenuStore from "../../stores/useMenuStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookBookmark, faGear, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {NAV_MENU} from "../../constants/textConstants";

function ContentCard({macroItem, onClick}) {
  const [isBookmark, setIsBookmark] = useState(macroItem.bookmark);
  const {setMacroItemList} = useMacroItemStore();
  const {setMacroStageList, setImageStageList, setUpdateTargetMacroName} = useMacroStageStore();
  const {setMenuMode} = useMenuStore();

  const macroName = macroItem.macroName;
  const macroUrl = macroItem.stageList[0].url;
  const birthDateObject = macroItem.birthTime;
  const accessDateObject = macroItem.accessTime;

  const birthTime = `${birthDateObject.getFullYear()}-${birthDateObject.getMonth() + 1}-${birthDateObject.getDate()}`;
  const accessTime = `${accessDateObject.getFullYear()}-${accessDateObject.getMonth() + 1}-${accessDateObject.getDate()}`;

  const handleBookmark = async (event) => {
    event.stopPropagation();

    if (macroItem.bookmark) {
      macroItem.bookmark = false;
    } else {
      macroItem.bookmark = true;
    }

    window.electronAPI.saveMacro(macroName, macroItem.bookmark, "bookmark");

    const bookmarkMacroList = await window.electronAPI.getMacroItemList();

    setMacroItemList(bookmarkMacroList);
    setIsBookmark(macroItem.bookmark);
  };

  const handleUpdate = async (event) => {
    event.stopPropagation();
    const savedImageList = await window.electronAPI.getMacroItem("image", macroName);
    const savedMacroList = await window.electronAPI.getMacroItem("stageList", macroName);

    setUpdateTargetMacroName(macroName);
    setImageStageList(savedImageList.image);
    setMacroStageList(savedMacroList.stageList);
    setMenuMode(NAV_MENU.ADDMACRO);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();

    const deletedMacroList = await window.electronAPI.deleteMacroAndImage(macroItem.macroName, true);
    setMacroItemList(deletedMacroList);
  };

  return (
    <div className="bg-white w-90 h-48 rounded-2xl m-5 p-3" onClick={onClick}>
      <div className="h-full w-full flex flex-col">
        <div className="h-[25%] w-30 flex items-center hover-big" onClick={handleBookmark}>
          <span className={`${isBookmark && "text-red"} my-4 mx-2 text-2xl cursor-pointer hover-big`}>
            <FontAwesomeIcon icon={faBookBookmark} />
          </span>
          <span className="my-4 mx-2 text-2xl cursor-pointer hover-big" onClick={handleUpdate}>
            <FontAwesomeIcon icon={faGear} />
          </span>
          <span className="my-4 mx-2 text-2xl cursor-pointer hover-big" onClick={handleDelete}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </span>
        </div>
        <p className="text-3xl m-3">{macroName}</p>
        <p className="overflow-x-scroll whitespace-nowrap">생성URL : {macroUrl}</p>
        <p>생성일 : {birthTime}</p>
        <p>사용일 : {accessTime}</p>
      </div>
    </div>
  );
}

export default ContentCard;
