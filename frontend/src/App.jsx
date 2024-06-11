import React from "react";
import { Routes, Route } from "react-router-dom";
import Inventory from "./Inventory";
import Landing from "./page/landing/Landing.jsx";
import Finance from "./Finance/Finance.jsx";

const App = () => {
  return (
    <>
      {/* <h1 className="text-[20px]">Welcome to CocoTrade🌴</h1>
      <br /> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/finance" element={<Finance />} />
      </Routes>
    </>
  );
};

export default App;
