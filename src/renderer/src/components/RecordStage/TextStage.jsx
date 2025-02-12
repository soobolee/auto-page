import Button from "../Button/Button";

function TextStage() {
  return (
    <aside className="w-full h-[15%] p-5 flex items-center flex-row border col-span-8">
      <Button buttonText={"시작"} buttonColor={"green"} />
      <div id="textStage" className="w-[17%] h-full mx-3 border"></div>
      <Button buttonText={"정지"} buttonColor={"red"} />
    </aside>
  );
}

export default TextStage;
