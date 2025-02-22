import {useState} from "react";
import useMacroStageStore from "../../stores/useMacroStageStore";

function DirectInputCard({stageItem, index}) {
  const [formData, setFormData] = useState(stageItem || {class: [{}]});
  const {macroImageList} = useMacroStageStore();

  const handleInputValue = (event) => {
    const {name, value} = event.target;

    if (name.includes("class")) {
      const classIndex = name.split("-")[1];
      const newClassArray = formData.class.map((classInfo, index) => {
        if (index === parseInt(classIndex)) {
          return {...classInfo, [name.split("-")[0]]: value};
        }
        return classInfo;
      });

      setFormData({...formData, class: newClassArray});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  return (
    <form className="w-full bg-white flex rounded-2xl">
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
          formData.class.map((classInfo, index) => {
            return (
              <li key={`classInfo${index}`}>
                <label className="w-25 inline-block">타겟 Class</label>
                <input
                  type="text"
                  name={`className-${index}`}
                  value={classInfo.className}
                  onChange={handleInputValue}
                  className="w-[29%] my-2 h-8 p-2 inline-block border mr-4 rounded-lg"
                  placeholder="[id 교차선택, 대소문자] . 제외"
                />
                <label className="w-20 inline-block">타겟 Index</label>
                <input
                  type="text"
                  name={`classIndex-${index}`}
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
      <div className="relative w-[35%] h-full p-3">
        <button type="button" className="absolute top-[-20px] right-[40px] w-10 h-10 bg-red text-white rounded-full">
          삭제
        </button>
        <button type="button" className="absolute top-[-20px] right-[-10px] w-10 h-10 bg-green text-white rounded-full">
          저장
        </button>
        <img src={macroImageList[index]} className={`${!macroImageList[index] && "invisible"} w-full h-full mb-2`} />
      </div>
    </form>
  );
}

export default DirectInputCard;
