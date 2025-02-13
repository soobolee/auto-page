function StageCard({direction}) {
  return <div className={`${direction === "row" ? "w-50 h-full mx-2" : "w-full h-29 my-2"} shrink-0 border`}></div>;
}

export default StageCard;
