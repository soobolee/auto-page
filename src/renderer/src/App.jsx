import {Outlet} from "react-router";

import Header from "./layout/Header/Header";
import DimModal from "./shared/Modal/DimModal";
import useModalStore from "./stores/modal/useModalStore";

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
