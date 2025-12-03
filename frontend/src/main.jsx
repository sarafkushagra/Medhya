import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import { logDomainInfo } from "./utils/getDomainInfo.js";
import "./index.css";
import { SocketProvider } from "./context/SocketProvider.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>
);
