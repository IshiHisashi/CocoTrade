import React, { useState } from "react";
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
import Auth from "./page/auth/Auth.jsx";
import Onboarding from "./page/onboarding/Onboarding.jsx";
import UserIdProvider from "./contexts/UserIdContext.jsx";
// import Settings from "";

const App = () => {
  const [user, setUser] = useState(null);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/" element={<Landing fnToSetUser={setUser} />} />
        <Route
          path="/onboarding/*"
          element={
            <UserIdProvider>
              <Onboarding />
            </UserIdProvider>
          }
        />
        <Route
          path="/dashboard"
          element={
            // <UserIdProvider>
            <Layout>
              <Dashboard />
            </Layout>
            // </UserIdProvider>
          }
        />
        <Route
          path="/inventory"
          element={
            // <UserIdProvider>
            <Layout>
              <Inventory />
            </Layout>
            // </UserIdProvider>
          }
        />
        <Route
          path="/purchase"
          element={
            // <UserIdProvider>
            <Layout>
              <Purchase />
            </Layout>
            // </UserIdProvider>
          }
        />
        <Route
          path="/sales"
          element={
            // <UserIdProvider>
            <Layout>
              <Sale />
            </Layout>
            // </UserIdProvider>
          }
        />
        <Route path="/sale/ViewSalesTable" element={<ViewSalesTable />} />
        <Route
          path="/finances"
          element={
            // <UserIdProvider>
            <Layout>
              <Finance />
            </Layout>
            // </UserIdProvider>
          }
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
