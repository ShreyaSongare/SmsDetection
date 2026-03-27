// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SmsProvider } from "./context/SmsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SmsProvider>
      <App />
    </SmsProvider>
  </BrowserRouter>
);
