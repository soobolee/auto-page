import React from "react";
import ReactDOM from "react-dom/client";
import {HashRouter, Route, Routes} from "react-router";

import App from "./App";
import {ROUTER_ROUTE} from "./constants/textConstants";
import MacroContent from "./features/Content/MacroContent";
import MainContent from "./features/Content/MainContent";

const container = document.getElementById("root");

if (!container) {
  const notFountRoot = document.createElement("div");
  notFountRoot.innerText = "root 컨텐츠를 찾지 못했습니다. 새로고침하거나 관리자에게 문의해주세요.";
  document.body.appendChild(notFountRoot);
} else {
  ReactDOM.createRoot(container).render(
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
}
