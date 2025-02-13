import StageCard from "../Card/StageCard";

function ImageStage() {
  return (
    <aside className="w-full h-full p-5 border flex flex-col overflow-scroll">
      <StageCard direction="col" />
    </aside>
  );
}

export default ImageStage;
