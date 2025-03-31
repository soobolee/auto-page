import {Outlet} from "react-router";

import Header from "./components/Header/Header";
import DimModal from "./components/Modal/DimModal";
import useModalStore from "./stores/useModalStore";

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
