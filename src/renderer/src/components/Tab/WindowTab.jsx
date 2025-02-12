function WindowTab({index, tabList, setTabList, setFocusTab, hidden}) {
  return (
    <div
      className={`${hidden ? "bg-amber-400" : "bg-tab"} w-[100px] p-2 mr-0.5 flex justify-between text-white rounded-t-xl`}
      onClick={() => {
        setFocusTab(index);
      }}
    >
      Naver
      <button
        className="text-white w-5 hover:rounded-full hover:bg-sub cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setTabList(tabList.filter((_, filterIndex) => filterIndex !== index));
        }}
      >
        X
      </button>
    </div>
  );
}

export default WindowTab;
