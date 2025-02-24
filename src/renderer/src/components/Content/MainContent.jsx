import {nanoid} from "nanoid";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router";
import useMacroStageStore from "../../stores/useMacroStageStore";
import useMacroItemStore from "../../stores/useMacroItemStore";
import useShortCutStore from "../../stores/useShortCutStore";
import useMenuStore from "../../stores/useMenuStore";
import useTabStore from "../../stores/useTabStore";
import EmptyCard from "../Card/EmptyCard";
import ContentCard from "../Card/ContentCard";
import ShortCutCard from "../Card/ShortCutCard";
import Navigation from "../Navigation/Navigation";
import DirectInputCard from "../Card/DirectInputCard";
import {ROUTER_ROUTE, NAV_MENU, MENU_TITLE} from "../../constants/textConstants";

function MainContent() {
  const [macroNameList, setMacroNameList] = useState([]);
  const {menuMode} = useMenuStore();
  const {macroStageList, updateTargetMacroName, setMacroStageList, setImageStageList, startMacroExecute, setUpdateTargetMacroName} =
    useMacroStageStore();
  const {shortCutUnitList, setShortCutUnitList} = useShortCutStore();
  const {macroItemList, setMacroItemList} = useMacroItemStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    async function getMacroItemList() {
      const macroInfoList = await window.electronAPI.getMacroItemList();
      const nameList = macroInfoList.map((macroInfo) => macroInfo.macroName);

      setMacroNameList(["매크로 선택", ...nameList]);
      setMacroItemList(macroInfoList);
    }

    getMacroItemList();
  }, [setMacroItemList, menuMode]);

  useEffect(() => {
    const handleShortCut = (event) => {
      if (event.target.tagName === "INPUT" || menuMode === NAV_MENU.ADDMACRO) {
        return;
      }

      setShortCutUnitList([...shortCutUnitList, event.key]);

      if (shortCutUnitList.length === 1) {
        const macroInfo = macroItemList.find((macroItem) => {
          if (macroItem.shortCut) {
            return macroItem.shortCut.firstKeyUnit === shortCutUnitList[0] && macroItem.shortCut.secondKeyUnit === event.key;
          }
        });

        if (!macroInfo) {
          return;
        }

        setMacroStageList(macroInfo.stageList);
        setBrowserTabList([{tabUrl: macroInfo.stageList[0].url}]);
        startMacroExecute();
        navigate(ROUTER_ROUTE.MACRO);
      }
    };

    const handleKeyup = (event) => {
      if (event.target.tagName === "INPUT" || menuMode === NAV_MENU.ADDMACRO) {
        return;
      }

      setShortCutUnitList([]);
    };

    document.addEventListener("keydown", handleShortCut);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      document.removeEventListener("keydown", handleShortCut);
      document.removeEventListener("keyup", handleKeyup);
    };
  }, [macroItemList, menuMode, navigate, setBrowserTabList, setMacroStageList, setShortCutUnitList, shortCutUnitList, startMacroExecute]);

  const handleUpdateSelect = async (event) => {
    setUpdateTargetMacroName(event.target.value);
    const savedImageList = await window.electronAPI.getMacroItem("image", event.target.value);
    const savedMacroList = await window.electronAPI.getMacroItem("stageList", event.target.value);

    setImageStageList(savedImageList.image);
    setMacroStageList(savedMacroList.stageList);
  };

  return (
    <div className="flex h-[90%]">
      <Navigation />
      <article className="w-full h-full flex justify-center items-center">
        <div className="w-[90%] h-[90%] bg-sub rounded-xl flex justify-center items-center flex-col">
          <p className="mt-12 text-3xl text-white">{MENU_TITLE[menuMode]}</p>
          {menuMode === NAV_MENU.HOME && (
            <div className="w-full h-full p-16 flex flex-row flex-wrap">
              {macroItemList.length > 0 &&
                macroItemList.map((item) => (
                  <ContentCard
                    key={nanoid()}
                    macroItem={item}
                    onClick={() => {
                      setMacroStageList(item.stageList);
                      setBrowserTabList([{tabUrl: item.stageList[0].url}]);
                      startMacroExecute();
                      navigate(ROUTER_ROUTE.MACRO);
                    }}
                  />
                ))}
              <EmptyCard />
            </div>
          )}
          {menuMode === NAV_MENU.BOOKMARK && (
            <div className="w-full h-full p-16 flex flex-row flex-wrap">
              {macroItemList.length > 0 &&
                macroItemList.map((item) => {
                  return (
                    item.bookmark && (
                      <ContentCard
                        key={nanoid()}
                        macroItem={item}
                        onClick={() => {
                          setMacroStageList(item.stageList);
                          setBrowserTabList([{tabUrl: item.stageList[0].url}]);
                          startMacroExecute();
                          navigate(ROUTER_ROUTE.MACRO);
                        }}
                      />
                    )
                  );
                })}
            </div>
          )}
          {menuMode === NAV_MENU.ADDMACRO && (
            <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-scroll">
              <div>
                <select value={updateTargetMacroName} onChange={handleUpdateSelect} className="w-100 p-4 bg-white text-lg rounded-xl">
                  {macroNameList &&
                    macroNameList.map((macroName) => (
                      <option key={nanoid()} value={macroName}>
                        {macroName}
                      </option>
                    ))}
                </select>
              </div>
              {macroStageList && macroStageList.map((stageItem, index) => <DirectInputCard key={nanoid()} stageItem={stageItem} index={index} />)}
            </div>
          )}
          {menuMode === NAV_MENU.SHORTCUT && (
            <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-scroll">
              {macroItemList.length > 0 ? (
                macroItemList.map((item) => <ShortCutCard key={nanoid()} macroItem={item} />)
              ) : (
                <p className="text-white">매크로가 없습니다. 매크로를 등록해주세요.</p>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default MainContent;
