import {nanoid} from "nanoid";

function StageCard({direction, stageInfo}) {
  return (
    <div className={`${direction === "row" ? "w-50 h-full mx-2" : "w-full h-29 my-2"} shrink-0 border text-white`}>
      {direction === "row" && (
        <>
          <p>method: {stageInfo.method}</p>
          <p>
            tag: {stageInfo.tagName} : {stageInfo.tagIndex}
          </p>
          <p>id: {stageInfo.id}</p>
          <div>
            {stageInfo.class &&
              stageInfo.class.map((stageClass) => (
                <div key={nanoid()}>
                  <p>
                    class: {stageClass.className} : {stageClass.classIndex}
                  </p>
                </div>
              ))}
          </div>
          <p>url: {stageInfo.url}</p>
          <p>href: {stageInfo.href}</p>
          <p>value: {stageInfo.value}</p>
        </>
      )}
      {direction === "col" && <img className="w-full h-full active-stage" src={stageInfo} />}
    </div>
  );
}

export default StageCard;
