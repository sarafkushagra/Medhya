import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import { logDomainInfo } from "./utils/getDomainInfo.js";
import "./index.css";
import { SocketProvider } from "./context/SocketProvider.jsx";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</SocketProvider>
);
