import {nanoid} from "nanoid";

function StageCard({direction, stageInfo}) {
  return (
    <div className={`${direction === "row" ? "w-50 h-full mx-2" : "w-full h-29 my-2"} shrink-0 border`}>
      {direction === "row" && (
        <>
          <p>{stageInfo.method}</p>
          <p>{stageInfo.id}</p>
          <div>
            {stageInfo.class.map((stageClass) => (
              <div key={nanoid()}>
                <p>
                  {stageClass.className} : {stageClass.classIndex}
                </p>
              </div>
            ))}
          </div>
          <p>{stageInfo.url}</p>
        </>
      )}
      {direction === "col" && <img className="w-full h-full" src={stageInfo} />}
    </div>
  );
}

export default StageCard;
