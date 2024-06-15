import React from "react";
import { Routes, Route } from "react-router-dom";
import Inventory from "./Inventory";
import Landing from "./page/landing/Landing.jsx";
import Finance from "./page/finance/Finance.jsx";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import Purchase from "./page/purchase/purchase.jsx";
import Sale from "./page/sale/sale.jsx"
import ViewPurchaseTable from "./page/purchase/ViewPurchaseTable.jsx";


const App = () => {
  return (
    <>
      {/* <h1 className="text-[20px]">Welcome to CocoTrade🌴</h1>
      <br /> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/purchase/ViewPurchaseTable" element={<ViewPurchaseTable />} />
      </Routes>
    </>
  );
};

export default App;
