import {nanoid} from "nanoid";
import {useNavigate, useMatch} from "react-router";
import {faArrowLeft, faArrowRight, faRotateRight, faFan} from "@fortawesome/free-solid-svg-icons";
import useTabStore from "../../stores/useTabStore";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useModalStore from "../../stores/useModalStore";
import useMenuStore from "../../stores/useMenuStore";
import WindowTab from "../Tab/WindowTab";
import Button from "../Button/Button";
import CircleButton from "../Button/CircleButton";
import LoadingCard from "../Card/LoadingCard";
import {ROUTER_ROUTE, RECORD_MODE} from "../../constants/textConstants";

function Header() {
  const navigate = useNavigate();

  const {browserTabList, resetTabInfo, tabFocusedIndex} = useTabStore();
  const {macroStageList, resetStageList, isMacroRecording, isMacroExecuting} = useMacroStageStore();
  const {openInputModal} = useModalStore();
  const {setRecordMode} = useMenuStore();
  const match = useMatch(ROUTER_ROUTE.MACRO);

  const handleMainClick = () => {
    if (isMacroExecuting) {
      return;
    }

    if (macroStageList.length > 1) {
      openInputModal();
    } else {
      setRecordMode(RECORD_MODE.AUTO);
      resetStageList();
      resetTabInfo();
      navigate(ROUTER_ROUTE.MAIN);
    }
  };

  const focusedTabInfo = browserTabList[tabFocusedIndex] || {};

  return (
    <header className="h-[10%] flex flex-col justify-around border">
      <div className="h-[15%] w-full" style={{WebkitAppRegion: "drag"}}></div>
      <div className="h-[35%] w-full flex justify-center">
        <div className="w-[70%] text-right px-10">
          {browserTabList[tabFocusedIndex] ? (
            <input
              type="text"
              value={browserTabList[tabFocusedIndex].tabUrl}
              className="w-200 bg-white py-2 px-4 mx-auto overflow-scroll rounded-2xl whitespace-nowrap"
              readOnly
            />
          ) : (
            <span className="mx-50 text-white text-2xl">Auto Page</span>
          )}
        </div>
        <div className="w-[15%] text-xl text-white">
          {isMacroRecording && <LoadingCard shape="ping" text="매크로 기록 중" />}
          {isMacroExecuting && <LoadingCard shape="spin" icon={faFan} text="매크로 실행 중" />}
        </div>
        <div className="w-[15%] text-right px-3">{match && <Button buttonText={"나가기"} buttonColor={"bg-sub"} onClick={handleMainClick} />}</div>
      </div>
      <div className="h-[40%] w-full flex items-end overflow-scroll">
        {browserTabList.length > 0 && (
          <>
            <CircleButton icon={faArrowLeft} onClick={focusedTabInfo.goBack} isActive={focusedTabInfo.canGoBack} />
            <CircleButton icon={faArrowRight} onClick={focusedTabInfo.goForward} isActive={focusedTabInfo.canGoForward} />
            <CircleButton icon={faRotateRight} onClick={focusedTabInfo.goReload} isActive={true} />
          </>
        )}
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index) => <WindowTab key={nanoid()} title={tab.title} index={index} isHidden={tabFocusedIndex === index} />)}
      </div>
    </header>
  );
}

export default Header;
