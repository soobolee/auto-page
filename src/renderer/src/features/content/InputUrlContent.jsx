import {nanoid} from "nanoid";
import {useEffect, useState} from "react";

import UrlInput from "../../shared/Input/UrlInput";
import useTabStore from "../../stores/tab/useTabStore";

function InputUrlContent() {
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

  return (
    <article className="flex items-center flex-col col-span-7">
      <div className="mt-40 text-white text-9xl">Auto Page</div>
      <div className="w-full mt-40 mb-18 flex justify-center">
        <UrlInput />
      </div>
      <div className="flex justify-center w-[70%] overflow-x-auto">
        {bookmarkUrlList.length > 0 &&
          bookmarkUrlList.map((bookmarkUrl) => (
            <button
              key={nanoid()}
              className="h-10 mx-1 p-2 bg-white text-nowrap rounded-xl"
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
