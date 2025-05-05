import {useEffect, useState} from "react";

import useTabStore from "../stores/tab/useTabStore";

const useBookmarkUrl = () => {
  const [bookmarkUrlList, setBookmarkUrlList] = useState<string[]>([]);
  const {setBrowserTabList} = useTabStore();

  const handleBookmarkClick = (bookmarkUrl: string) => {
    setBrowserTabList([{tabUrl: bookmarkUrl}]);
  };

  useEffect(() => {
    const urlList: string = window.localStorage.getItem("bookmarkUrl") || "";

    if (urlList.length > 0) {
      setBookmarkUrlList(JSON.parse(urlList));
    }
  }, []);

  return {bookmarkUrlList, handleBookmarkClick};
};

export default useBookmarkUrl;
