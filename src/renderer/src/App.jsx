import {Outlet} from "react-router";
import Header from "./components/Header/Header";

function App() {
  return (
    <main className="w-full h-full bg-main">
      <Header></Header>
      <Outlet />
    </main>
  );
}

export default App;
