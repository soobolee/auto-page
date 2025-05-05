import {MacroClass, MacroStage} from "@renderer/types/macro";
import {ChangeEvent, JSX, useState} from "react";

import {
  ALERT_DELETE_STAGE,
  ALERT_ERROR_DELETE,
  ALERT_ERROR_SAVE,
  ALERT_SAVE_STAGE,
  NAV_MENU,
} from "../../constants/textConstants";
import useMacroStore from "../../stores/macro/useMacroStore";
import useMenuStore from "../../stores/menu/useMenuStore";
import useModalStore from "../../stores/modal/useModalStore";

interface UpdateCardProps {
  stageItem: MacroStage;
  index: number;
}

function UpdateCard({stageItem, index}: UpdateCardProps): JSX.Element {
  const [formData, setFormData] = useState<MacroStage>(stageItem || {class: [{}], url: ""});
  const {
    macroStageList,
    macroImageList,
    updateTargetMacroName,
    setMacroStageList,
    setMacroImageList,
    setMacroItemList,
  } = useMacroStore();
  const {setMenuMode} = useMenuStore();
  const {openAlertModal, closeModal} = useModalStore();

  const handleInputValue = (event: ChangeEvent<HTMLInputElement>): void => {
    const {name, value} = event.target;

    if (name.includes("class")) {
      const classIndex = name.split("-")[1];
      const newClassArray = formData.class
        ? formData.class.map((classInfo: MacroClass, idx: number) => {
            if (idx === parseInt(classIndex)) {
              return {...classInfo, [name.split("-")[0]]: value};
            }
            return classInfo;
          })
        : [];

      setFormData({...formData, class: newClassArray});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleDeleteButton = (): void => {
    const clickDelete = async (): Promise<void> => {
      const newStageList = [...macroStageList];
      const newImageList = macroImageList ? [...macroImageList] : [];

      newStageList.splice(index, 1);
      newImageList.splice(index, 1);

      if (newStageList.length === 0 && newImageList.length === 0) {
        const deletedList = await window.electronAPI.saveMacro(updateTargetMacroName, [], "stageList");

        if (!deletedList) {
          openAlertModal(ALERT_ERROR_DELETE);
        }

        setMacroItemList([]);
        setMenuMode(NAV_MENU.HOME);
      } else {
        const savedStageResult = await window.electronAPI.saveMacro(updateTargetMacroName, newStageList, "stageList");
        const savedImageResult = await window.electronAPI.saveImage(updateTargetMacroName, newImageList);

        if (savedStageResult && savedImageResult) {
          setMacroStageList(newStageList);
          setMacroImageList(newImageList);
        } else {
          openAlertModal(ALERT_ERROR_SAVE);
        }
      }

      closeModal();
    };

    openAlertModal(ALERT_DELETE_STAGE, clickDelete);
  };

  const handleSaveButton = (): void => {
    const clickSave = async (): Promise<void> => {
      const newList = [...macroStageList];
      newList[index] = formData;

      const savedResult = await window.electronAPI.saveMacro(updateTargetMacroName, newList, "stageList");

      closeModal();

      if (savedResult) {
        setMacroStageList(newList);
      } else {
        openAlertModal(ALERT_ERROR_SAVE);
      }
    };

    openAlertModal(ALERT_SAVE_STAGE, clickSave);
  };

  return (
    <form className="w-full bg-white flex rounded-2xl">
      <ul className="w-[65%] p-3 ml-4">
        <li>
          <label className="w-25 inline-block">타겟 Tag</label>
          <input
            type="text"
            name="tagName"
            value={formData.tagName || ""}
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
            value={formData.id || ""}
            onChange={handleInputValue}
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[class 교차선택, 대소문자] # 제외"
          />
        </li>
        {formData.class &&
          formData.class.map((classInfo: MacroClass, idx: number) => {
            return (
              <li key={`classInfo${idx}`}>
                <label className="w-25 inline-block">타겟 Class</label>
                <input
                  type="text"
                  name={`className-${idx}`}
                  value={classInfo.className || ""}
                  onChange={handleInputValue}
                  className="w-[29%] my-2 h-8 p-2 inline-block border mr-4 rounded-lg"
                  placeholder="[id 교차선택, 대소문자] . 제외"
                />
                <label className="w-20 inline-block">타겟 Index</label>
                <input
                  type="text"
                  name={`classIndex-${idx}`}
                  value={classInfo.classIndex || ""}
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
            value={formData.href || ""}
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
            value={formData.value || ""}
            onChange={handleInputValue}
            className="w-[70%] my-2 h-8 p-2 inline-block border rounded-lg"
            placeholder="[선택] input태그에 입력하고 싶은 값"
          />
        </li>
        <li>
          <input type="hidden" name="method" value={formData.method || ""} />
        </li>
      </ul>
      <div className="relative w-[35%] h-full p-3">
        <button
          type="button"
          className="absolute top-[-20px] right-[40px] w-10 h-10 bg-red text-white rounded-full hover-big"
          onClick={handleDeleteButton}
        >
          삭제
        </button>
        <button
          type="button"
          className="absolute top-[-20px] right-[-10px] w-10 h-10 bg-green text-white rounded-full hover-big"
          onClick={handleSaveButton}
        >
          저장
        </button>
        {macroImageList && (
          <img
            src={macroImageList[index]}
            className={`${!macroImageList[index] && "invisible"} w-full h-full hover-image`}
          />
        )}
      </div>
    </form>
  );
}

export default UpdateCard;
