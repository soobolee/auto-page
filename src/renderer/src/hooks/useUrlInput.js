import {useEffect, useState} from "react";

function useUrlInput(setBrowserTabList, browserTabList, tabFocusedIndex) {
  const [inputUrl, setInputUrl] = useState("");
  const [isUrlError, setIsUrlError] = useState(false);
  const [bookmarkUrlList, setBookmarkUrlList] = useState([]);

  const validationHttpsUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === "https:" || url.protocol === "http:";
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

        const newList = Array.from(new Set([...bookmarkUrlList, inputUrl]));
        setBookmarkUrlList(newList);
        window.localStorage.setItem("bookmarkUrl", JSON.stringify(newList));
      } else {
        setInputUrl("");
        setIsUrlError(true);
      }
    }
  };

  const handleInputChange = (event) => {
    setInputUrl(event.target.value);
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("bookmarkUrl");
    if (saved) {
      setBookmarkUrlList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (browserTabList[tabFocusedIndex]) {
      setInputUrl(browserTabList[tabFocusedIndex].tabUrl);
    }
  }, [browserTabList, tabFocusedIndex]);

  return {
    inputUrl,
    isUrlError,
    handleInputEnter,
    handleInputChange,
  };
}

export default useUrlInput;
