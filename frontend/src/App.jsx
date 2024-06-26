import React from "react";
import { Routes, Route } from "react-router-dom";
import Inventory from "./page/inventory/Inventory.jsx";
import Landing from "./page/landing/Landing.jsx";
import Finance from "./page/finance/Finance.jsx";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import Purchase from "./page/purchase/purchase.jsx";
import Sale from "./page/sale/sale.jsx";
import ViewSalesTable from "./page/sale/ViewSalesTable.jsx";
import Layout from "./Layout.jsx";
// import Settings from "";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/inventory"
        element={
          <Layout>
            <Inventory />
          </Layout>
        }
      />
      <Route
        path="/finances"
        element={
          <Layout>
            <Finance />
          </Layout>
        }
      />
      <Route
        path="/purchase"
        element={
          <Layout>
            <Purchase />
          </Layout>
        }
      />
      <Route
        path="/sales"
        element={
          <Layout>
            <Sale />
          </Layout>
        }
      />
      <Route path="/sale/ViewSalesTable" element={<ViewSalesTable />} />
      <Route path="/settings" element={<Layout>{/* <Settings /> */}</Layout>} />
    </Routes>
  );
};

export default App;
