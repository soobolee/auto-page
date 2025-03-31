import React from "react";
import ReactDOM from "react-dom/client";
import {HashRouter, Route, Routes} from "react-router";

import App from "./App";
import MacroContent from "./components/Content/MacroContent";
import MainContent from "./components/Content/MainContent";
import {ROUTER_ROUTE} from "./constants/textConstants";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path={ROUTER_ROUTE.MAIN} element={<App />}>
          <Route index element={<MainContent />} />
          <Route path={ROUTER_ROUTE.MACRO} element={<MacroContent />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
