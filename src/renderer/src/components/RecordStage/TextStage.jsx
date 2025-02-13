import Button from "../Button/Button";

function TextStage() {
  return (
    <aside className="w-full h-[15%] p-5 flex justify-between items-center flex-row border col-span-8">
      <Button buttonText={"시작"} buttonColor={"bg-green"} />
      <div className="w-[90%] h-full flex overflow-scroll"></div>
      <Button buttonText={"정지"} buttonColor={"bg-red"} />
    </aside>
  );
}

export default TextStage;
