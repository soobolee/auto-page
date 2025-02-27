function PillCard({cardText}) {
  return (
    <label>
      <div className="p-2 m-1 overflow-x-scroll font-bold whitespace-nowrap bg-sub rounded-4xl">{cardText}</div>
    </label>
  );
}

export default PillCard;
