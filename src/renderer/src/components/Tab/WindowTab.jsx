import useTabStore from "../../store/useTabStore";

function WindowTab({index, isHidden}) {
  const {browserTabList, tabFocusedIndex, setBrowserTabList, setTabFocusedIndex} = useTabStore();

  return (
    <div
      className={`${isHidden ? "bg-amber-400" : "bg-tab"} w-[100px] p-2 mr-0.5 flex justify-between text-white rounded-t-xl`}
      onClick={() => {
        setTabFocusedIndex(index);
      }}
    >
      Naver
      <button
        className="text-white w-5 hover:rounded-full hover:bg-sub cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setBrowserTabList(browserTabList.filter((_, filterIndex) => filterIndex !== index));

          let newFocuedIndex = tabFocusedIndex;

          if (tabFocusedIndex >= index) {
            newFocuedIndex = tabFocusedIndex - 1;
          }
          if (newFocuedIndex < 0) {
            newFocuedIndex = 0;
          }

          setTabFocusedIndex(newFocuedIndex);
        }}
      >
        X
      </button>
    </div>
  );
}

export default WindowTab;
