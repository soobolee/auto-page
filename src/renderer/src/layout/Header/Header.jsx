import {faArrowLeft, faArrowRight, faFan, faRotateRight} from "@fortawesome/free-solid-svg-icons";
import {nanoid} from "nanoid";
import {useEffect, useState} from "react";
import {useMatch, useNavigate} from "react-router";

import {RECORD_MODE, ROUTER_ROUTE} from "../../constants/textConstants";
import WindowTab from "../../features/tab/WindowTab";
import Button from "../../shared/Button/Button";
import CircleButton from "../../shared/Button/CircleButton";
import LoadingCard from "../../shared/Card/LoadingCard";
import useMacroStageStore from "../../stores/macro/useMacroStageStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useTabStore from "../../stores/tab/useTabStore";

function Header() {
  const [inputUrl, setInputUrl] = useState("");
  const [isUrlError, setIsUrlError] = useState("");
  const navigate = useNavigate();

  const {browserTabList, resetTabInfo, tabFocusedIndex, setBrowserTabList} = useTabStore();
  const {resetStageList, isMacroRecording, isMacroExecuting} = useMacroStageStore();
  const {setRecordMode} = useMenuStore();
  const match = useMatch(ROUTER_ROUTE.MACRO);

  const focusedTabInfo = browserTabList[tabFocusedIndex] || {};

  useEffect(() => {
    if (browserTabList[tabFocusedIndex]) {
      setInputUrl(browserTabList[tabFocusedIndex].tabUrl);
    }
  }, [browserTabList, tabFocusedIndex]);

  const handleInput = (event) => {
    setInputUrl(event.target.value);
  };

  const handleMainClick = () => {
    setRecordMode(RECORD_MODE.STOP);
    resetStageList();
    resetTabInfo();
    navigate(ROUTER_ROUTE.MAIN);
    window.sessionStorage.removeItem("resumeMacroList");
  };

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
        const newBrowserTabList = [...browserTabList];
        newBrowserTabList[tabFocusedIndex] = {tabUrl: inputUrl};

        setIsUrlError(false);
        setBrowserTabList(newBrowserTabList);
      } else {
        setInputUrl("");
        setIsUrlError(true);
      }
    }
  };

  return (
    <header className="h-[10%] flex flex-col justify-around border">
      <div className="h-[15%] w-full" style={{WebkitAppRegion: "drag"}}></div>
      <div className="h-[35%] w-full flex justify-center">
        <div className="w-[70%] text-right px-10">
          {browserTabList[tabFocusedIndex] ? (
            <input
              type="text"
              value={inputUrl}
              onChange={handleInput}
              onKeyDown={handleInputEnter}
              className="w-200 bg-white py-2 px-4 mx-auto overflow-auto rounded-2xl whitespace-nowrap"
              placeholder={isUrlError ? "잘못된 URL을 입력했습니다." : "매크로 기록 URL 입력"}
            />
          ) : (
            <span className="mx-50 text-white text-2xl">Auto Page</span>
          )}
        </div>
        <div className="w-[15%] text-xl text-white">
          {isMacroRecording && <LoadingCard shape="ping" text="매크로 기록 중" />}
          {isMacroExecuting && <LoadingCard shape="spin" icon={faFan} text="매크로 실행 중" />}
        </div>
        <div className="w-[15%] text-right px-3">
          {match && <Button buttonText={"나가기"} buttonColor={"bg-sub"} onClick={handleMainClick} />}
        </div>
      </div>
      <div className="h-[40%] w-full flex items-end overflow-auto">
        {browserTabList.length > 0 && (
          <>
            <CircleButton icon={faArrowLeft} onClick={focusedTabInfo.goBack} isActive={focusedTabInfo.canGoBack} />
            <CircleButton
              icon={faArrowRight}
              onClick={focusedTabInfo.goForward}
              isActive={focusedTabInfo.canGoForward}
            />
            <CircleButton icon={faRotateRight} onClick={focusedTabInfo.goReload} isActive={true} />
          </>
        )}
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index) => (
            <WindowTab key={nanoid()} title={tab.title} index={index} isHidden={tabFocusedIndex === index} />
          ))}
      </div>
    </header>
  );
}

export default Header;
