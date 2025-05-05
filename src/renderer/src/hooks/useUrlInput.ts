import {TabStore} from "@renderer/types/stores";
import {KeyboardEvent, useEffect, useState} from "react";

type SetBrowserTabList = TabStore["setBrowserTabList"];
type BrowserTabList = TabStore["browserTabList"];
type TabFocusedIndex = TabStore["tabFocusedIndex"];

const useUrlInput = (
  setBrowserTabList: SetBrowserTabList,
  browserTabList: BrowserTabList,
  tabFocusedIndex: TabFocusedIndex
) => {
  const [inputUrl, setInputUrl] = useState("");
  const [isUrlError, setIsUrlError] = useState(false);
  const [bookmarkUrlList, setBookmarkUrlList] = useState<string[]>([]);

  const validationHttpsUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  };

  const handleInputEnter = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      const isUrl = validationHttpsUrl(inputUrl);

      if (isUrl) {
        setIsUrlError(false);
        setBrowserTabList([{tabUrl: inputUrl}]);

        const newList: string[] = Array.from(new Set([...bookmarkUrlList, inputUrl]));
        setBookmarkUrlList(newList);
        window.localStorage.setItem("bookmarkUrl", JSON.stringify(newList));
      } else {
        setInputUrl("");
        setIsUrlError(true);
      }
    }
  };

  const handleInputChange = (event: KeyboardEvent<HTMLInputElement>): void => {
    const target = event.target;
    if (!target || !(target instanceof HTMLInputElement)) {
      return;
    }

    setInputUrl(target.value);
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("bookmarkUrl");
    if (saved) {
      setBookmarkUrlList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (browserTabList[tabFocusedIndex]) {
      const url = browserTabList[tabFocusedIndex].tabUrl;

      if (typeof url === "string") {
        setInputUrl(url);
      }
    }
  }, [browserTabList, tabFocusedIndex]);

  return {
    inputUrl,
    isUrlError,
    handleInputEnter,
    handleInputChange,
  };
};

export default useUrlInput;
