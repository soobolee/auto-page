import {nanoid} from "nanoid";

import Card from "./Card";
import PillCard from "./PillCard";

function StageCard({direction, stageInfo}) {
  return (
    <Card variant="stage" className={`${direction === "row" ? "w-50 h-full mx-2" : "w-full h-29 my-2"}`}>
      {direction === "row" && (
        <div className="w-full h-full p-2 overflow-auto">
          <PillCard cardText={`${stageInfo.tagName} ${stageInfo.method}`} />
          {stageInfo.id && <PillCard cardText={stageInfo.id} />}
          <div>
            {stageInfo.class &&
              stageInfo.class.map(({className}) => (
                <div key={nanoid()}>
                  <PillCard cardText={className} />
                </div>
              ))}
          </div>
          <PillCard cardText={stageInfo.url} />
          {stageInfo.href && <PillCard cardText={stageInfo.href} />}
          {stageInfo.value && <PillCard cardText={stageInfo.value} />}
        </div>
      )}
      {direction === "col" && <img className="w-full h-full active-stage" src={stageInfo} />}
    </Card>
  );
}

export default StageCard;
