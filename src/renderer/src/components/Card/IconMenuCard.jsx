import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookBookmark, faGear, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

function IconMenuCard({isBookmark, handleBookmark, handleUpdate, handleDelete}) {
  return (
    <div className="h-[25%] w-30 ml-53 flex items-center hover-big" onClick={handleBookmark}>
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
  );
}

export default IconMenuCard;
