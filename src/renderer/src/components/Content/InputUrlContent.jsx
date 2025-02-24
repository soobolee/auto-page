import {useEffect, useState} from "react";
import useTabStore from "../../stores/useTabStore";
import {nanoid} from "nanoid";

function InputUrlContent() {
  const [inputUrl, setInputUrl] = useState("");
  const [isUrlError, setIsUrlError] = useState("");
  const [bookmarkUrlList, setBookmarkUrlList] = useState([]);
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

        const newBookmarkUrlList = [...bookmarkUrlList];
        newBookmarkUrlList.push(inputUrl);

        const dedUpeSet = new Set(newBookmarkUrlList);
        const dedUpeList = Array.from(dedUpeSet);

        setBookmarkUrlList(dedUpeList);
        window.localStorage.setItem("bookmarkUrl", JSON.stringify(dedUpeList));
      } else {
        setInputUrl("");
        setIsUrlError(true);
      }
    }
  };

  const handleInput = (event) => {
    setInputUrl(event.target.value);
  };

  const handleBookmarkClick = (bookmarkUrl) => {
    setBrowserTabList([{tabUrl: bookmarkUrl}]);
  };

  useEffect(() => {
    const urlList = window.localStorage.getItem("bookmarkUrl") || [];

    if (urlList.length > 0) {
      setBookmarkUrlList(JSON.parse(urlList));
    }
  }, []);

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
      <div className="flex justify-center w-[70%] overflow-x-scroll">
        {bookmarkUrlList.length > 0 &&
          bookmarkUrlList.map((bookmarkUrl) => (
            <button
              key={nanoid()}
              className="w-40 h-10 mx-1 p-2 bg-white text-nowrap rounded-xl overflow-x-scroll"
              onClick={() => handleBookmarkClick(bookmarkUrl)}
            >
              {bookmarkUrl}
            </button>
          ))}
      </div>
    </article>
  );
}

export default InputUrlContent;
