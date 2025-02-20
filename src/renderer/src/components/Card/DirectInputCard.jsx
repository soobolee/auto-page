function DirectInputCard() {
  return (
    <div className="w-full h-80 bg-white flex rounded-2xl">
      <ul className="w-[65%] h-full p-3 ml-4">
        <li>
          <label className="w-25 inline-block">타겟 Tag</label>
          <input type="text" className="w-[70%] my-2 h-8 inline-block border rounded-lg" />
        </li>
        <li>
          <label className="w-25 inline-block">타겟 Id</label>
          <input type="text" className="w-[70%] my-2 h-8 inline-block border rounded-lg" />
        </li>
        <li>
          <label className="w-25 inline-block">타겟 Class</label>
          <input type="text" className="w-[29%] my-2 h-8 inline-block border mr-4 rounded-lg" />
          <label className="w-20 inline-block">타겟 Index</label>
          <input type="text" className="w-[29%] my-2 h-8 inline-block border rounded-lg" />
        </li>
        <li>
          <label className="w-25 inline-block">이벤트 URL</label>
          <input type="text" className="w-[70%] my-2 h-8 inline-block border rounded-lg" />
        </li>
        <li>
          <label className="w-25 inline-block">목적지 URL</label>
          <input type="text" className="w-[70%] my-2 h-8 inline-block border rounded-lg" />
        </li>
        <li>
          <label className="w-25 inline-block">삽입 문자</label>
          <input type="text" className="w-[70%] my-2 h-8 inline-block border rounded-lg" />
        </li>
      </ul>
      <div className="w-[35%] h-full p-3">
        <img src="" className="w-full h-full border-2" />
      </div>
    </div>
  );
}

export default DirectInputCard;
