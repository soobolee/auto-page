import {JSX} from "react";

import useUrlInput from "../../hooks/useUrlInput";
import useTabStore from "../../stores/tab/useTabStore";

function UrlInput(): JSX.Element {
  const {setBrowserTabList, browserTabList, tabFocusedIndex} = useTabStore();

  const {inputUrl, isUrlError, handleInputEnter, handleInputChange} = useUrlInput(
    setBrowserTabList,
    browserTabList,
    tabFocusedIndex
  );

  return (
    <input
      type="text"
      className="w-[50%] h-10 p-4 rounded-4xl bg-white placeholder:italic overflow-auto"
      value={inputUrl}
      onKeyDown={handleInputEnter}
      onChange={handleInputChange}
      placeholder={isUrlError ? "잘못된 URL을 입력했습니다." : "매크로 기록 URL 입력"}
    />
  );
}

export default UrlInput;
