import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inventory from "./page/inventory/Inventory.jsx";
import Landing from "./page/landing/Landing.jsx";
import Finance from "./page/finance/Finance.jsx";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import Purchase from "./page/purchase/purchase.jsx";
import Sale from "./page/sale/sale.jsx";
import ViewSalesTable from "./page/sale/ViewSalesTable.jsx";
import Layout from "./Layout.jsx";
import Onboarding from "./page/onboarding/Onboarding.jsx";
import { UserIdContext } from "./contexts/UserIdContext.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import Setting from "./page/setting/Setting.jsx";
import NotFound from "./page/others/NotFound.jsx";

const AppRoutes = ({ userid, setUser, URL }) => {
  return (
    <LoadingProvider>
      <Routes>
        <Route path="/" element={<Landing fnToSetUser={setUser} URL={URL} />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/onboarding/*" element={<Onboarding URL={URL} />} />
        {userid && (
          <>
            <Route
              path="/dashboard"
              element={
                <LoadingProvider>
                  <Layout URL={URL}>
                    <Dashboard URL={URL} />
                  </Layout>
                </LoadingProvider>
              }
            />
            <Route
              path="/inventory"
              element={
                <LoadingProvider>
                  <Layout URL={URL}>
                    <Inventory URL={URL} />
                  </Layout>
                </LoadingProvider>
              }
            />
            <Route
              path="/purchase"
              element={
                <LoadingProvider>
                  <Layout URL={URL}>
                    <Purchase URL={URL} />
                  </Layout>
                </LoadingProvider>
              }
            />
            <Route
              path="/sales"
              element={
                <LoadingProvider>
                  <Layout URL={URL}>
                    <Sale URL={URL} />
                  </Layout>
                </LoadingProvider>
              }
            />
            <Route path="/sale/ViewSalesTable" element={<ViewSalesTable />} />
            <Route
              path="/finances"
              element={
                <LoadingProvider>
                  <Layout URL={URL}>
                    <Finance URL={URL} />
                  </Layout>
                </LoadingProvider>
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
      </Routes>
    </LoadingProvider>
  );
};

const App = () => {
  const userid = useContext(UserIdContext);
  const [user, setUser] = useState(null);
  const [URL, setURL] = useState("https://coco-trade-backend.vercel.app");

  return (
    <Router>
      <AppRoutes userid={userid} setUser={setUser} URL={URL} />
    </Router>
  );
};

export default App;
