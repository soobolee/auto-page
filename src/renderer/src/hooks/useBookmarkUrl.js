import {useEffect, useState} from "react";

import useTabStore from "../stores/tab/useTabStore";

function useBookmarkUrl() {
  const [bookmarkUrlList, setBookmarkUrlList] = useState([]);
  const {setBrowserTabList} = useTabStore();

  const handleBookmarkClick = (bookmarkUrl) => {
    setBrowserTabList([{tabUrl: bookmarkUrl}]);
  };

  useEffect(() => {
    const urlList = window.localStorage.getItem("bookmarkUrl") || [];

    if (urlList.length > 0) {
      setBookmarkUrlList(JSON.parse(urlList));
    }
  }, []);

  return {bookmarkUrlList, handleBookmarkClick};
}

export default useBookmarkUrl;
