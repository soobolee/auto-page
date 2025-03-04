function PillCard({cardText}) {
  return (
    <label>
      <p className="w-full p-2 m-1 overflow-ellipsis overflow-hidden font-bold whitespace-nowrap bg-sub rounded-4xl">{cardText}</p>
    </label>
  );
}

export default PillCard;
