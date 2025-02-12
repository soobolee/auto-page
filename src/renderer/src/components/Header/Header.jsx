import {useNavigate} from "react-router";
import WindowTab from "../Tab/WindowTab";

function Header({tabInfo: {tabList, setTabList, focusTab, setFocusTab}}) {
  const navigate = useNavigate();

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
        {tabList.length > 0 &&
          tabList.map((tabUrl, index) => (
            <WindowTab key={tabUrl} index={index} tabList={tabList} setTabList={setTabList} setFocusTab={setFocusTab} hidden={focusTab === index} />
          ))}
      </div>
    </header>
  );
}

export default Header;
