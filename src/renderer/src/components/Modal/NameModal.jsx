import useUserConfigStore from "../../stores/useUserConfigStore";
import Button from "../Button/Button";

function NameModal() {
  const {closeModal} = useUserConfigStore();

  const clickModalClose = () => {
    closeModal();
  };

  return (
    <div className="w-[90%] h-[80%] bg-white rounded-3xl border-2 flex justify-center items-center flex-col">
      <p className="text-3xl">기록한 매크로의 이름을 적어주세요.</p>
      <input type="text" className="w-[40%] h-16 p-2 m-20 border-3 rounded-3xl" placeholder="기억하기 쉬운 이름을 적어 주면 좋아요" />
      <div>
        <Button buttonText={"저장"} buttonColor={"bg-green"} />
        <Button buttonText={"취소"} buttonColor={"bg-red"} onClick={clickModalClose} />
      </div>
    </div>
  );
}

export default NameModal;
