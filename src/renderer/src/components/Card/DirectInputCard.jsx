import {useState, useRef, useEffect} from "react";
import {nanoid} from "nanoid";
import useMacroStageStore from "../../stores/useMacroStageStore";
import Button from "../Button/Button";

function DirectInputCard({stageList, index}) {
  const [formData, setFormData] = useState(stageList ? stageList : {});
  const {macroStageList, macroImageList, updateTargetMacroName, setMacroStageList} = useMacroStageStore();
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current && stageList) {
      setFormData(stageList);
    }
  }, [stageList]);

  const handleInputValue = (event) => {
    const target = event.target;

    if (target.name.includes("class")) {
      return;
    } else {
      setFormData({...formData, [target.name]: target.value});
      setMacroStageList((state) => (state[index] = formData));
    }
  };

  return (
    <form ref={formRef} className="w-full bg-white flex rounded-2xl">
      <ul className="w-[65%] p-3 ml-4">
        <li>
          <label className="w-25 inline-block">타겟 Tag</label>
          <input
            type="text"
            name="tagName"
            value={formData.tagName}
            onChange={handleInputValue}
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="A, BUTTON, INPUT 이벤트 태그"
          />
        </li>
        <li>
          <label className="w-25 inline-block">타겟 Id</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputValue}
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[class 교차선택, 대소문자] # 제외"
          />
        </li>
        {formData.class &&
          formData.class.map((classInfo) => {
            return (
              <li key={nanoid()}>
                <label className="w-25 inline-block">타겟 Class</label>
                <input
                  type="text"
                  name="className"
                  value={classInfo.className}
                  onChange={handleInputValue}
                  className="w-[29%] my-2 h-8 p-2 inline-block border mr-4 rounded-lg"
                  placeholder="[id 교차선택, 대소문자] . 제외"
                />
                <label className="w-20 inline-block">타겟 Index</label>
                <input
                  type="text"
                  name="classIndex"
                  value={classInfo.classIndex}
                  onChange={handleInputValue}
                  className="w-[29%] my-2 h-8 p-2 inline-block border rounded-lg"
                  placeholder="[선택 - 기본 : 0] 숫자만 입력"
                />
              </li>
            );
          })}
        <li>
          <label className="w-25 inline-block">이벤트 URL</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleInputValue}
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[필수] https://www.example.com"
          />
        </li>
        <li>
          <label className="w-25 inline-block">목적지 URL</label>
          <input
            type="text"
            name="href"
            value={formData.href}
            onChange={handleInputValue}
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[선택] https://www.example.com/login"
          />
        </li>
        <li>
          <label className="w-25 inline-block">삽입 문자</label>
          <input
            type="text"
            name="value"
            value={formData.value}
            onChange={handleInputValue}
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[선택] input태그에 입력하고 싶은 값"
          />
        </li>
        <li>
          <input type="hidden" name="method" value={formData.value} />
        </li>
      </ul>
      <div className="w-[35%] h-full p-3">
        <img src={macroImageList[index]} className={`${!macroImageList[index] && "invisible"} w-full h-[80%] mb-2`} />
        {macroStageList.length - 1 === index && (
          <div>
            <Button
              buttonText={"추가"}
              buttonColor={"bg-subsub"}
              onClick={() => {
                macroStageList.push({});
                setMacroStageList([...macroStageList]);
              }}
            />
            <Button
              buttonText={"취소"}
              buttonColor={macroStageList.length > 1 ? "bg-red" : "bg-sub"}
              onClick={() => {
                if (macroStageList.length > 1) {
                  macroStageList.pop();
                  setMacroStageList([...macroStageList]);
                }
              }}
            />
            <Button
              buttonText={"저장"}
              buttonColor={macroStageList.length > 1 ? "bg-green" : "bg-sub"}
              onClick={() => {
                if (macroStageList.length > 1) {
                  window.electronAPI.saveMacro(updateTargetMacroName, macroStageList, "stageList");
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
