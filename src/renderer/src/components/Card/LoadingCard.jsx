import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function LoadingCard({shape, icon, text}) {
  return (
    <div className="flex justify-center leading-15 items-center">
      {shape === "ping" && <div className="w-5 h-5 mr-5 animate-ping rounded-full bg-red opacity-100"></div>}
      {shape === "spin" && (
        <div className="w-8 h-8 mr-3 animate-spin text-3xl text-green">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <p className="text-left">{text}</p>
    </div>
  );
}

export default LoadingCard;
