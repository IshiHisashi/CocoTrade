import React from "react";
import { Routes, Route } from "react-router-dom";
import Inventory from "./page/inventory/Inventory.jsx";
import Landing from "./page/landing/Landing.jsx";
import Finance from "./page/finance/Finance.jsx";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import Purchase from "./page/purchase/purchase.jsx";
import Sale from "./page/sale/sale.jsx";
import ViewSalesTable from './page/sale/ViewSalesTable.jsx';

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
        <Route path="/sale/ViewSalesTable" element={<ViewSalesTable />} />

      </Routes>
    </>
  );
};

export default App;
