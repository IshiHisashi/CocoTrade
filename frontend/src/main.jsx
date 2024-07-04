import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserIdProvider from "./contexts/UserIdContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserIdProvider>
      <App />
    </UserIdProvider>
  </React.StrictMode>
);
