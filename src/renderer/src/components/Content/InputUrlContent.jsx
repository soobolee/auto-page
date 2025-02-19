import {useState} from "react";
import useTabStore from "../../stores/useTabStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";

function InputUrlContent() {
  const [inputUrl, setInputUrl] = useState("");
  const [isUrlError, setIsUrlError] = useState("");
  const {setBrowserTabList} = useTabStore();

  const validationHttpsUrl = (urlString) => {
    try {
      const url = new URL(urlString);

      if (url.protocol === "https:" || url.protocol === "http:") {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const handleInputEnter = (event) => {
    if (event.key === "Enter") {
      const isUrl = validationHttpsUrl(inputUrl);

      if (isUrl) {
        setIsUrlError(false);
        setBrowserTabList([{tabUrl: inputUrl}]);
      } else {
        setInputUrl("");
        setIsUrlError(true);
      }
    }
  };

  const handleInput = (event) => {
    setInputUrl(event.target.value);
  };

  return (
    <article className="flex items-center flex-col col-span-7">
      <div className="mt-40 text-white text-9xl">Auto Page</div>
      <div className="w-full mt-40 mb-18 flex justify-center">
        <input
          type="text"
          className="w-[50%] h-14 p-4 rounded-4xl bg-white placeholder:italic overflow-auto"
          value={inputUrl}
          onKeyDown={handleInputEnter}
          onChange={handleInput}
          placeholder={isUrlError ? "잘못된 URL을 입력했습니다." : "매크로 기록 URL 입력"}
        />
      </div>
      <div>
        <FontAwesomeIcon className="text-white text-5xl cursor-pointer hover:text-subsub" icon={faSquarePlus} />
      </div>
    </article>
  );
}

export default InputUrlContent;
