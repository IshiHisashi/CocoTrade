import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import PriceIndicatorCard from "../../component/card/PriceIndicatorCard.jsx";
import UserIdContext from "./UserIdContext.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const getData = async (userId, targetLog) => {
  // 66654dc4c6e950671e988962
  // purchase or sale
  const res = await axios.get(
    `http://localhost:5555/tmpFinRoute/${userId}/${targetLog}/monthly-aggregate`
  );
  const dataArrayRes =
    targetLog === "purchase"
      ? res.data.data.purchaseAggregation
      : res.data.data.salesAggregation;
  const dataArray = dataArrayRes.slice(-2);
  return dataArray;
};

const getMonthName = (year, monthNum) => {
  const date = new Date(year, monthNum - 1, 1);
  const month = date.toLocaleString("default", { month: "long" });
  return month;
};

const Dashboard = () => {
  const [purchase, setPurchase] = useState(null);
  const [sales, setSales] = useState(null);

  useEffect(() => {
    (async () => {
      const dataArrayP = await getData("66654dc4c6e950671e988962", "purchase");
      setPurchase(dataArrayP);

      const dataArrayS = await getData("66654dc4c6e950671e988962", "sale");
      setSales(dataArrayS);
    })();
  }, []);

  return (
    <UserIdContext.Provider value="66640d8158d2c8dc4cedaf1e">
      <p>You have an upcoming shipment on May 8, 2024</p>
      <button type="button">Add Purchase</button>

      <section className="grid grid-cols-2">
        <PriceIndicatorCard type="market" />
        <PriceIndicatorCard type="suggestion" />
      </section>

      <section>
        <h2>Cashflow this month vs last month</h2>
        {!purchase || !sales ? (
          <p>loading...</p>
        ) : (
          <Bar
            data={{
              labels: [
                // eslint-disable-next-line no-underscore-dangle
                getMonthName(purchase[0]._id.year, purchase[0]._id.month),
                // eslint-disable-next-line no-underscore-dangle
                getMonthName(purchase[1]._id.year, purchase[1]._id.month),
              ],
              datasets: [
                {
                  label: "Purchase",
                  data: [
                    purchase[0].monthlyPurchase.$numberDecimal,
                    purchase[1].monthlyPurchase.$numberDecimal,
                  ],
                },
                {
                  label: "Sales",
                  data: [
                    sales[0].monthlySales.$numberDecimal,
                    sales[1].monthlySales.$numberDecimal,
                  ],
                },
              ],
            }}
            options={{
              indexAxis: "y",
            }}
          />
        )}
      </section>
    </UserIdContext.Provider>
  );
};

export default Dashboard;
