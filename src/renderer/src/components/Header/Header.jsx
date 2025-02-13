import {useNavigate} from "react-router";
import {nanoid} from "nanoid";
import {faArrowLeft, faArrowRight, faRotateRight} from "@fortawesome/free-solid-svg-icons";
import useTabStore from "../../store/useTabStore";
import useMacroStageStore from "../../store/useMacroStageStore";
import WindowTab from "../Tab/WindowTab";
import Button from "../Button/Button";
import CircleButton from "../Button/CircleButton";

function Header() {
  const navigate = useNavigate();
  const {browserTabList, tabFocusedIndex, resetTabInfo} = useTabStore();
  const {resetStageList} = useMacroStageStore();

  const handleLogoClick = () => {
    resetTabInfo();
    resetStageList();
    navigate("/");
  };

  const focusedTabInfo = browserTabList[tabFocusedIndex] || {};

  return (
    <header className="h-[10%] flex flex-col justify-around border">
      <div className="h-[15%] w-full" style={{WebkitAppRegion: "drag"}}></div>
      <div className="h-[35%] w-full flex">
        <h3 className="text-white text-2xl mx-auto">Auto Pape</h3>
        <Button buttonText={"메인"} buttonColor={"bg-sub"} onClick={handleLogoClick} />
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
