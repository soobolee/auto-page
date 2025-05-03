import {nanoid} from "nanoid";

import useBookmarkUrl from "../../hooks/useBookmarkUrl";
import UrlInput from "../../shared/Input/UrlInput";

function InputUrlContent() {
  const {bookmarkUrlList, handleBookmarkClick} = useBookmarkUrl();

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
