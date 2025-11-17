import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CoinsProvider } from "./context/CoinsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CoinsProvider>
      <App />
    </CoinsProvider>
  </AuthProvider>
);
