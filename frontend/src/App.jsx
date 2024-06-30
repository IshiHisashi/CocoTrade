import React from "react";
import {
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Inventory from "./page/inventory/Inventory.jsx";
import Landing from "./page/landing/Landing.jsx";
import Finance from "./page/finance/Finance.jsx";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import Purchase from "./page/purchase/purchase.jsx";
import Sale from "./page/sale/sale.jsx";
import ViewSalesTable from "./page/sale/ViewSalesTable.jsx";
import Layout from "./Layout.jsx";
import Auth from "./page/auth/Auth.jsx"
// import Settings from "";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/auth" element={<Auth />} />
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
        <Route
          path="/finances"
          element={
            <Layout>
              <Finance />
            </Layout>
          }
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
