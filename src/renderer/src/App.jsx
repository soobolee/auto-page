import {Outlet} from "react-router";
import useModalStore from "./stores/useModalStore";
import Header from "./components/Header/Header";
import DimModal from "./components/Modal/DimModal";

function App() {
  const {isShowInputModal, isShowAlertModal} = useModalStore();
  const isShow = isShowInputModal || isShowAlertModal;

  return (
    <main className="w-full h-full bg-main">
      <Header />
      <Outlet />
      {isShow && <DimModal />}
    </main>
  );
}

export default App;
