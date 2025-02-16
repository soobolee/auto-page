import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookBookmark, faGear, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

function ContentCard({macroItem}) {
  const macroName = Object.keys(macroItem)[0];
  const macroUrl = JSON.parse(macroItem[macroName])[0].url;

  return (
    <div className="bg-white w-80 h-48 rounded-2xl m-5 p-3">
      <div className="h-full w-full flex flex-col">
        <div className="h-[60%] w-full">
          <div>
            <FontAwesomeIcon className="my-4 mx-2 text-xl cursor-pointer" icon={faBookBookmark} />
            <FontAwesomeIcon className="my-4 mx-2 text-xl cursor-pointer" icon={faGear} />
            <FontAwesomeIcon className="my-4 mx-2 text-xl cursor-pointer" icon={faCircleXmark} />
          </div>

          <p className="text-3xl">{macroName}</p>
        </div>
        <p>생성URL : {macroUrl}</p>
      </div>
    </div>
  );
}

export default ContentCard;
