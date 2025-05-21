import {JSX, memo} from "react";

import Card from "./Card";

interface PillCardProps {
  cardText: string;
}

const PillCard = memo(function PillCard({cardText}: PillCardProps): JSX.Element {
  return (
    <label>
      <Card>{cardText}</Card>
    </label>
  );
});

export default PillCard;
