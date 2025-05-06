import {JSX} from "react";

import Card from "./Card";

function PillCard({cardText}: {cardText: string}): JSX.Element {
  return (
    <label>
      <Card>{cardText}</Card>
    </label>
  );
}

export default PillCard;
