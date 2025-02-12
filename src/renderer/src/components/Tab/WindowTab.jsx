function WindowTab({index, setFocusTab, hidden}) {
  return (
    <div
      className={`${hidden ? "bg-amber-400" : "bg-tab"} w-[100px] h-10 p-2 mx-0.5 pl-4 text-white rounded-t-xl`}
      onClick={() => {
        setFocusTab(index);
      }}
    >
      Naver
    </div>
  );
}

export default WindowTab;
