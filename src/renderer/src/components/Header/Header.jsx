import {useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faRotateRight} from "@fortawesome/free-solid-svg-icons";
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
        <button className="w-8 h-8 my-1 ml-2 bg-sub rounded-4xl hover:bg-gray-500">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button className="w-8 h-8 my-1 mx-1 bg-sub rounded-4xl hover:bg-gray-500">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button className="w-8 h-8 my-1 mr-2 bg-sub rounded-4xl hover:bg-gray-500">
          <FontAwesomeIcon className="text-white" icon={faRotateRight} />
        </button>
        {browserTabList.length > 0 &&
          browserTabList.map((tab, index) => <WindowTab key={tab.tabUrl} title={tab.title} index={index} isHidden={tabFocusedIndex === index} />)}
      </div>
    </header>
  );
}

export default Header;
