import {useEffect} from "react";
import EmptyCard from "../Card/EmptyCard";
import ContentCard from "../Card/ContentCard";
import Navigation from "../Navigation/Navigation";
import useMacroItemStore from "../../stores/useMacroItemStore";
import {nanoid} from "nanoid";

function MainContent() {
  const {macroItemList, setMacroItemList} = useMacroItemStore();

  useEffect(() => {
    async function getMacroItem() {
      const macroItemList = await window.electronAPI.getMacroItem();

      const parseItemList = macroItemList.map((macroItem) => {
        const macroName = Object.keys(macroItem)[0];

        return {[macroName]: macroItem[macroName]};
      });

      setMacroItemList(parseItemList);
    }

    getMacroItem();
  }, [setMacroItemList]);

  return (
    <div className="flex h-[90%]">
      <Navigation />
      <article className="w-full h-full flex justify-center items-center">
        <div className="w-[90%] h-[90%] bg-sub rounded-xl flex justify-center items-center flex-col">
          <p className="mt-12 text-3xl text-white">매크로를 추가하고 바로 시작해 보세요.</p>
          <div className="w-full h-full p-16 flex flex-row flex-wrap">
            {macroItemList.length > 0 && macroItemList.map((item) => <ContentCard key={nanoid()} macroItem={item} />)}
            <EmptyCard />
          </div>
        </div>
      </article>
    </div>
  );
}

export default MainContent;
