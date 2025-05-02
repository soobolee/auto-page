import {useEffect, useState} from "react";

import useTabStore from "../../stores/tab/useTabStore";

function UrlInput() {
  const [inputUrl, setInputUrl] = useState("");
  const [isUrlError, setIsUrlError] = useState("");
  const [bookmarkUrlList, setBookmarkUrlList] = useState([]);
  const {setBrowserTabList, browserTabList, tabFocusedIndex} = useTabStore();

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

  useEffect(() => {
    if (browserTabList[tabFocusedIndex]) {
      setInputUrl(browserTabList[tabFocusedIndex].tabUrl);
    }
  }, [browserTabList, tabFocusedIndex]);

  return (
    <input
      type="text"
      className="w-[50%] h-10 p-4 rounded-4xl bg-white placeholder:italic overflow-auto"
      value={inputUrl}
      onKeyDown={handleInputEnter}
      onChange={handleInput}
      placeholder={isUrlError ? "잘못된 URL을 입력했습니다." : "매크로 기록 URL 입력"}
    />
  );
}

export default UrlInput;
