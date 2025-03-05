import {nanoid} from "nanoid";
import {useEffect} from "react";
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
import UpdateCard from "../Card/UpdateCard";
import {ROUTER_ROUTE, NAV_MENU, MENU_TITLE, ALERT_ERROR_LOAD, ALERT_ERROR_SAVE} from "../../constants/textConstants";
import useModalStore from "../../stores/useModalStore";

function MainContent() {
  const {menuMode} = useMenuStore();
  const {macroStageList, updateTargetMacroName, setMacroStageList, setImageStageList, startMacroExecute, setUpdateTargetMacroName} =
    useMacroStageStore();
  const {shortCutUnitList, setShortCutUnitList} = useShortCutStore();
  const {macroItemList, setMacroItemList} = useMacroItemStore();
  const {openAlertModal} = useModalStore();
  const {setBrowserTabList} = useTabStore();

  const navigate = useNavigate();

  useEffect(() => {
    async function getMacroItemList() {
      const macroInfoList = await window.electronAPI.getMacroItemList();

      if (!macroInfoList) {
        openAlertModal(ALERT_ERROR_LOAD);
      }

      setMacroItemList(macroInfoList);
    }

    getMacroItemList();
  }, [setMacroItemList, openAlertModal]);

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

    if (!savedImageList || !savedMacroList) {
      openAlertModal(ALERT_ERROR_SAVE);
    }

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
            <div className="w-full h-full p-16 flex justify-center flex-row flex-wrap overflow-auto">
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
              {macroItemList.length > 0 ? (
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
                })
              ) : (
                <p className="text-white mx-auto">북마크 버튼을 눌러 북마크를 등록해 편하게 보세요.</p>
              )}
            </div>
          )}
          {menuMode === NAV_MENU.ADDMACRO && (
            <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-auto">
              <div>
                <select value={updateTargetMacroName} onChange={handleUpdateSelect} className="w-100 p-4 bg-white text-lg rounded-xl" place>
                  <option>매크로를 선택해 주세요.</option>
                  {macroItemList &&
                    macroItemList.map((macroItem) => (
                      <option key={nanoid()} value={macroItem.macroName}>
                        {macroItem.macroName}
                      </option>
                    ))}
                </select>
              </div>
              {macroStageList && macroStageList.map((stageItem, index) => <UpdateCard key={nanoid()} stageItem={stageItem} index={index} />)}
            </div>
          )}
          {menuMode === NAV_MENU.SHORTCUT && (
            <div className="w-full h-full p-16 flex flex-col items-center gap-10 overflow-auto">
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
