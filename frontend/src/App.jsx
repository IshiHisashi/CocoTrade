import React, { useState, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
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
import NotFound from "./page/NotFound.jsx";

const AppRoutes = ({ userid, setUser, URL }) => {
  const navigate = useNavigate();
  console.log(userid);
  // useEffect(() => {
  //   if (!userid) {
  //     navigate("/");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing fnToSetUser={setUser} URL={URL} />} />
      <Route path="/*" element={<NotFound />} />
      <Route path="/onboarding/*" element={<Onboarding URL={URL} />} />
      {userid && (
        <>
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
          {/* <Route path="/*" element={<NotFound />} /> */}
        </>
      )}
    </Routes>
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
