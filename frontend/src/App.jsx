import React from "react";
import { Routes, Route } from "react-router-dom";
import Inventory from "./Inventory";
import Landing from "./page/landing/Landing.jsx";

const App = () => {
  return (
    <>
      {/* <h1 className="text-[20px]">Welcome to CocoTrade🌴</h1>
      <br /> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Add your page the following lines */}
      </Routes>
    </>
  );
};

export default App;
