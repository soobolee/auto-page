import {useNavigate} from "react-router";
import useTabStore from "../../store/useTabStore";
import WindowTab from "../Tab/WindowTab";

function Header() {
  const navigate = useNavigate();
  const {browserTabList, tabFocusedIndex} = useTabStore();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="h-[10%] flex flex-col justify-around border">
      <div className="h-[15%] w-full" style={{WebkitAppRegion: "drag"}}></div>
      <div className="h-[35%] w-full text-center">
        <h3 className="text-white text-2xl" onClick={handleLogoClick}>
          Auto Pape
        </h3>
      </div>
      <div className="h-[40%] w-full flex items-end overflow-scroll">
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index) => <WindowTab key={tab.tabUrl} title={tab.title} index={index} isHidden={tabFocusedIndex === index} />)}
      </div>
    </header>
  );
}

export default Header;
