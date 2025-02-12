import {useState} from "react";
import {Outlet} from "react-router";
import Header from "./components/Header/Header";

function App() {
  const [tabList, setTabList] = useState([]);
  const [focusTab, setFocusTab] = useState(0);

  return (
    <main className="w-full h-full bg-main">
      <Header tabInfo={{tabList, setTabList, focusTab, setFocusTab}} />
      <Outlet context={{tabList, setTabList, focusTab, setFocusTab}} />
    </main>
  );
}

export default App;
