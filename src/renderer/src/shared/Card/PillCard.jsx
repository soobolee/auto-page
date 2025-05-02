import Card from "./Card";

function PillCard({cardText}) {
  return (
    <label>
      <Card>{cardText}</Card>
    </label>
  );
}

export default PillCard;
