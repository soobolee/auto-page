import {faArrowLeft, faArrowRight, faFan, faRotateRight} from "@fortawesome/free-solid-svg-icons";
import {nanoid} from "nanoid";
import {CSSProperties, JSX} from "react";
import {useMatch, useNavigate} from "react-router";

import {RECORD_MODE, ROUTER_ROUTE} from "../../constants/textConstants";
import WindowTab from "../../features/Tab/WindowTab";
import Button from "../../shared/Button/Button";
import LoadingCard from "../../shared/Card/LoadingCard";
import UrlInput from "../../shared/Input/UrlInput";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useTabStore from "../../stores/tab/useTabStore";

function Header(): JSX.Element {
  const navigate = useNavigate();

  const {browserTabList, resetTabInfo, tabFocusedIndex} = useTabStore();
  const {resetStageList, isMacroRecording, isMacroExecuting} = useMacroStore();
  const {setRecordMode} = useMenuStore();
  const match = useMatch(ROUTER_ROUTE.MACRO);

  const focusedTabInfo = browserTabList[tabFocusedIndex] || {};

  const handleMainClick = (): void => {
    setRecordMode(RECORD_MODE.STOP);
    resetStageList();
    resetTabInfo();
    navigate(ROUTER_ROUTE.MAIN);
    window.sessionStorage.removeItem("resumeMacroList");
  };
  console.log(browserTabList);

  return (
    <header className="h-[10%] flex flex-col justify-around border">
      <div className="h-[15%] w-full" style={{WebkitAppRegion: "drag"} as CSSProperties}></div>
      <div className="h-[35%] w-full flex justify-center">
        <div className="w-[70%] text-right px-10">
          {browserTabList[tabFocusedIndex] ? (
            <UrlInput />
          ) : (
            <span className="mx-50 text-white text-2xl">Auto Page</span>
          )}
        </div>
        <div className="w-[15%] text-xl text-white">
          {isMacroRecording && <LoadingCard shape="ping" text="매크로 기록 중" />}
          {isMacroExecuting && <LoadingCard shape="spin" icon={faFan} text="매크로 실행 중" />}
        </div>
        <div className="w-[15%] text-right px-3">
          {match && (
            <Button color="red" onClick={handleMainClick}>
              나가기
            </Button>
          )}
        </div>
      </div>
      <div className="h-[40%] w-full flex items-end overflow-auto">
        {browserTabList.length > 0 && (
          <>
            <Button
              variant="circle"
              size="small"
              icon={faArrowLeft}
              onClick={focusedTabInfo.goBack}
              isActive={focusedTabInfo.canGoBack}
            />
            <Button
              variant="circle"
              size="small"
              icon={faArrowRight}
              onClick={focusedTabInfo.goForward}
              isActive={focusedTabInfo.canGoForward}
            />
            <Button
              variant="circle"
              size="small"
              icon={faRotateRight}
              onClick={focusedTabInfo.goReload}
              isActive={true}
            />
          </>
        )}
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index: number) => (
            <WindowTab key={nanoid()} title={tab.title} index={index} isHidden={tabFocusedIndex === index} />
          ))}
      </div>
    </header>
  );
}

export default Header;
