import {nanoid} from "nanoid";

function StageCard({direction, stageInfo}) {
  return (
    <div className={`${direction === "row" ? "w-50 h-full mx-2" : "w-full h-29 my-2"} shrink-0 border`}>
      {direction === "row" ? (
        <>
          <p>{stageInfo.method}</p>
          <p>{stageInfo.id}</p>
          <p>
            {stageInfo.class.map((stageClass) => (
              <div key={nanoid()}>
                <span>{stageClass.className} : </span>
                <span>{stageClass.classIndex}</span>
              </div>
            ))}
          </p>
          <p>{stageInfo.url}</p>
        </>
      ) : (
        <>{stageInfo.img}</>
      )}
    </div>
  );
}

export default StageCard;
