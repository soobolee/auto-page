import NameModal from "./NameModal";

function DimModal() {
  const handleEvent = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-sub/50 flex justify-center items-center" onClick={handleEvent}>
      <NameModal />
    </div>
  );
}

export default DimModal;
