import {Outlet} from "react-router";
import useUserConfigStore from "./stores/useUserConfigStore";
import Header from "./components/Header/Header";
import DimModal from "./components/Modal/DimModal";

function App() {
  const {isShowModal} = useUserConfigStore();

  return (
    <main className="w-full h-full bg-main">
      <Header />
      <Outlet />
      {isShowModal && <DimModal />}
    </main>
  );
}

export default App;
