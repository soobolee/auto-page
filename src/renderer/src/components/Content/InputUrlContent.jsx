import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";

function InputUrlContent({setUserInputUrl, setHasUrl}) {
  return (
    <article className="flex items-center flex-col col-span-7">
      <div className="mt-40 text-white text-9xl">Auto Page</div>
      <div className="w-full mt-40 mb-18 flex justify-center">
        <input
          type="text"
          className="w-[50%] h-14 p-4 rounded-4xl bg-white placeholder:italic overflow-auto"
          onChange={(event) => {
            setUserInputUrl(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setHasUrl(true);
            }
          }}
          placeholder="매크로 기록 URL 입력"
        />
      </div>
      <div>
        <FontAwesomeIcon className="text-white text-5xl cursor-pointer hover:text-subsub" icon={faSquarePlus} />
      </div>
    </article>
  );
}

export default InputUrlContent;
