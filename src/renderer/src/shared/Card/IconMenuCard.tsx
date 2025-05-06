import {faBookBookmark, faCircleXmark, faGear} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {JSX, MouseEvent} from "react";

interface IconMenuCardProps {
  isBookmark: boolean;
  handleBookmark: (event: MouseEvent<HTMLSpanElement>) => void;
  handleUpdate: (event: MouseEvent<HTMLSpanElement>) => void;
  handleDelete: (event: MouseEvent<HTMLSpanElement>) => void;
}

function IconMenuCard({isBookmark, handleBookmark, handleUpdate, handleDelete}: IconMenuCardProps): JSX.Element {
  return (
    <div className="h-[25%] w-30 ml-53 flex items-center hover-big">
      <span
        className={`${isBookmark && "text-red"} my-4 mx-2 text-2xl cursor-pointer hover-big`}
        onClick={handleBookmark}
      >
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
