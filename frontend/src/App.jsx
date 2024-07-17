import React, { useState, useContext } from "react";
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
import { UserIdContext } from "./contexts/UserIdContext.jsx";
import Setting from "./page/setting/Setting.jsx";

const App = () => {
  const userid = useContext(UserIdContext);
  const [user, setUser] = useState(null);
  const [URL, setURL] = useState("http://localhost:5555");
  console.log(userid);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {!userid ? (
          // Before log-in, user is always navigated to landing page
          <>
            <Route
              path="/*"
              element={<Landing fnToSetUser={setUser} URL={URL} />}
            />
            <Route path="/onboarding/*" element={<Onboarding URL={URL} />} />
          </>
        ) : (
          // After log-in, user can go inside the application
          <>
            <Route
              path="/"
              element={<Landing fnToSetUser={setUser} URL={URL} />}
            />
            <Route path="/onboarding/*" element={<Onboarding URL={URL} />} />
            <Route
              path="/dashboard"
              element={
                <Layout URL={URL}>
                  <Dashboard URL={URL} />
                </Layout>
              }
            />
            <Route
              path="/inventory"
              element={
                <Layout URL={URL}>
                  <Inventory URL={URL} />
                </Layout>
              }
            />
            <Route
              path="/purchase"
              element={
                <Layout URL={URL}>
                  <Purchase URL={URL} />
                </Layout>
              }
            />
            <Route
              path="/sales"
              element={
                <Layout URL={URL}>
                  <Sale URL={URL} />
                </Layout>
              }
            />
            <Route path="/sale/ViewSalesTable" element={<ViewSalesTable />} />
            <Route
              path="/finances"
              element={
                <Layout URL={URL}>
                  <Finance URL={URL} />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout URL={URL}>
                  <Setting URL={URL} />
                </Layout>
              }
            />
          </>
        )}
        {/* <Route path="/" element={<Landing fnToSetUser={setUser} URL={URL} />} />
        <Route path="/onboarding/*" element={<Onboarding URL={URL} />} /> */}
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
