import ContentCard from "../Card/ContentCard";
import EmptyCard from "../Card/EmptyCard";

function MainContent() {
  return (
    <article className="w-full h-full flex justify-center items-center">
      <div className="w-[90%] h-[90%] bg-sub rounded-xl flex justify-center items-center flex-col">
        <p className="mt-12 text-3xl text-white">매크로를 추가하고 바로 시작해 보세요.</p>
        <div className="w-full h-full p-16 flex flex-row flex-wrap">
          <ContentCard />
          <EmptyCard />
        </div>
      </div>
    </article>
  );
}

export default MainContent;
