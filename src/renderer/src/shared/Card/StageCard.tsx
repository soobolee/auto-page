import {MacroStage} from "@renderer/types/macro";
import {nanoid} from "nanoid";

import Card from "./Card";
import PillCard from "./PillCard";

interface StageCardProps {
  direction: "row" | "col";
  stageInfo: MacroStage | string;
}

function StageCard({direction, stageInfo}: StageCardProps) {
  const isRow = direction === "row";

  return (
    <Card variant="stage" className={`${isRow ? "w-50 h-full mx-2" : "w-full h-29 my-2"}`}>
      {isRow && typeof stageInfo !== "string" && (
        <div className="w-full h-full p-2 overflow-auto">
          <PillCard cardText={`${stageInfo.tagName} ${stageInfo.method}`} />
          {stageInfo.id && <PillCard cardText={stageInfo.id} />}
          {stageInfo.class?.map(({className}) => (
            <div key={nanoid()}>
              <PillCard cardText={className} />
            </div>
          ))}
          <PillCard cardText={stageInfo.url} />
          {stageInfo.href && <PillCard cardText={stageInfo.href} />}
          {stageInfo.value && <PillCard cardText={stageInfo.value} />}
        </div>
      )}

      {!isRow && typeof stageInfo === "string" && <img className="w-full h-full active-stage" src={stageInfo} />}
    </Card>
  );
}

export default StageCard;
