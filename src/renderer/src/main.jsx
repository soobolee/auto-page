import React from "react";
import ReactDOM from "react-dom/client";
import {HashRouter, Route, Routes} from "react-router";
import App from "./App";
import MainContent from "./components/Content/MainContent";
import MacroContent from "./components/Content/MacroContent";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<MainContent />} />
          <Route path="/macro" element={<MacroContent />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
