import React from "react";
import { Routes, Route } from "react-router-dom";
import Inventory from "./page/inventory/Inventory";
import Landing from "./page/landing/Landing.jsx";

const App = () => {
  return (
    <>
      {/* <h1 className="text-[20px]">Welcome to CocoTrade🌴</h1>
      <br /> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </>
  );
};

export default App;
