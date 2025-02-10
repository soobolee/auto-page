import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";

function MacroContent() {
  return (
    <article className="w-full h-[90%] mt-40 flex justify-start items-center flex-col">
      <div className="text-white text-9xl">Auto Page</div>
      <div className="w-full mt-40 mb-18 flex justify-center">
        <input type="text" className="w-[50%] h-14 p-4 rounded-4xl bg-white placeholder:italic overflow-auto" placeholder="매크로 기록 URL 입력" />
      </div>
      <div>
        <FontAwesomeIcon className="text-white text-5xl cursor-pointer hover:text-subsub" icon={faSquarePlus} />
      </div>
    </article>
  );
}

export default MacroContent;
