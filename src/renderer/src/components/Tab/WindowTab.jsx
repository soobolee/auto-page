import useTabStore from "../../stores/useTabStore";

function WindowTab({index, title, isHidden}) {
  const {browserTabList, tabFocusedIndex, setBrowserTabList, setTabFocusedIndex} = useTabStore();

  return (
    <div
      className={`${isHidden ? "bg-amber-400" : "bg-tab"} w-[8rem] p-2 mr-0.5 flex text-white text-xs justify-between rounded-t-xl`}
      onClick={() => {
        setTabFocusedIndex(index);
      }}
      title={title}
    >
      <p className="w-14 text-nowrap overflow-hidden">{title}</p>
      <button
        className="w-5 text-xs hover:rounded-full hover:bg-sub cursor-pointer"
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
