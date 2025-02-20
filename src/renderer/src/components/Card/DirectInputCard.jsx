import useMenuStore from "../../stores/useMenuStore";
import Button from "../Button/Button";

function DirectInputCard({configList, index}) {
  const {macroConfigList, directMacroName, addMacroConfigList} = useMenuStore();

  return (
    <form className="w-full h-80 bg-white flex rounded-2xl">
      <ul className="w-[65%] h-full p-3 ml-4">
        <li>
          <label className="w-25 inline-block">타겟 Tag</label>
          <input
            type="text"
            name="tagName"
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="A, BUTTON, INPUT 이벤트 태그"
          />
        </li>
        <li>
          <label className="w-25 inline-block">타겟 Id</label>
          <input
            type="text"
            id="id"
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[class 교차선택, 대소문자] # 제외"
          />
        </li>
        <li>
          <label className="w-25 inline-block">타겟 Class</label>
          <input
            type="text"
            name="className"
            className="w-[29%] my-2 h-8 p-2 inline-block border mr-4 rounded-lg"
            placeholder="[id 교차선택, 대소문자] . 제외"
          />
          <label className="w-20 inline-block">타겟 Index</label>
          <input
            type="text"
            name="classIndex"
            className="w-[29%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[선택 - 기본 : 0] 숫자만 입력"
          />
        </li>
        <li>
          <label className="w-25 inline-block">이벤트 URL</label>
          <input
            type="text"
            name="url"
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[필수] https://www.example.com"
          />
        </li>
        <li>
          <label className="w-25 inline-block">목적지 URL</label>
          <input
            type="text"
            name="href"
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[선택] https://www.example.com/login"
          />
        </li>
        <li>
          <label className="w-25 inline-block">삽입 문자</label>
          <input
            type="text"
            name="value"
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[선택] input태그에 입력하고 싶은 값"
          />
        </li>
      </ul>
      <div className="w-[35%] h-full p-3">
        <img src={configList.image} className={`${!configList.image && "invisible"} w-full h-[80%] mb-2`} />
        {macroConfigList.length - 1 === index && (
          <div>
            <Button
              buttonText={"추가"}
              buttonColor={"bg-subsub"}
              onClick={() => {
                macroConfigList.push({});
                addMacroConfigList([...macroConfigList]);
              }}
            />
            <Button
              buttonText={"취소"}
              buttonColor={macroConfigList.length > 1 ? "bg-red" : "bg-sub"}
              onClick={() => {
                if (macroConfigList.length > 1) {
                  macroConfigList.pop();
                  addMacroConfigList([...macroConfigList]);
                }
              }}
            />
            <Button
              buttonText={"저장"}
              buttonColor={macroConfigList.length > 1 ? "bg-green" : "bg-sub"}
              onClick={() => {
                if (macroConfigList.length > 1) {
                  window.electronAPI.saveMacro(directMacroName, macroConfigList, "stageList");
                }
              }}
            />
          </div>
        )}
      </div>
    </form>
  );
}

export default DirectInputCard;
