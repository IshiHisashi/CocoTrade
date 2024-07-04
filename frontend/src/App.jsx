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
// import { UserIdContext } from "./contexts/UserIdContext.jsx";
// import UserIdProvider from "./contexts/UserIdContext.jsx";
// import Settings from "";

const App = () => {
  const [user, setUser] = useState(null);
  const [URL, setURL] = useState("http://localhost:5555");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/auth/*" element={<Auth URL={URL} />} />
        <Route path="/" element={<Landing fnToSetUser={setUser} URL={URL} />} />
        <Route
          path="/onboarding/*"
          element={
            // <UserIdProvider>
            <Onboarding URL={URL} />
            // </UserIdProvider>
          }
        />
        <Route
          path="/dashboard"
          element={
            // <UserIdProvider>
            <Layout URL={URL}>
              <Dashboard URL={URL} />
            </Layout>
            // <UserIdProvider>
          }
        />
        <Route
          path="/inventory"
          element={
            // <UserIdProvider>
            <Layout URL={URL}>
              <Inventory URL={URL} />
            </Layout>
            // </UserIdProvider>
          }
        />
        <Route
          path="/purchase"
          element={
            // <UserIdProvider>
            <Layout URL={URL}>
              <Purchase URL={URL} />
            </Layout>
            // </UserIdProvider>
          }
        />
        <Route
          path="/sales"
          element={
            // <UserIdProvider>
            <Layout URL={URL}>
              <Sale URL={URL} />
            </Layout>
            // </UserIdProvider>
          }
        />
        <Route path="/sale/ViewSalesTable" element={<ViewSalesTable />} />
        <Route
          path="/finances"
          element={
            // <UserIdProvider>
            <Layout URL={URL}>
              <Finance URL={URL} />
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
