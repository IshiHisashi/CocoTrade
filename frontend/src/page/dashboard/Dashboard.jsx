import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import PriceIndicatorCard from "../../component/card/PriceIndicatorCard.jsx";
import UserIdContext from "./UserIdContext.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const getData = async (userId, targetLog) => {
  // 66654dc4c6e950671e988962
  const res = await axios.get(
    `http://localhost:5555/tmpFinRoute/${userId}/${targetLog}/monthly-aggregate`
  );

  if (
    (targetLog === "purchase" &&
      res.data.data.purchaseAggregation.length === 0) ||
    (targetLog === "sales" && res.data.data.salesAggregation.length === 0)
  ) {
    return null;
  }

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
  const userId = useContext(UserIdContext);
  const [purchase, setPurchase] = useState(null);
  const [sales, setSales] = useState(null);

  useEffect(() => {
    (async () => {
      const [dataArrayP, dataArrayS] = await Promise.all([
        // user doc and purchase/sales log doc utilize different user so hard code for now.
        getData("66654dc4c6e950671e988962", "purchase"),
        // getData(userId, "purchase"),
        getData("66654dc4c6e950671e988962", "sale"),
        // getData(userId, "sale"),
      ]);
      setPurchase(dataArrayP);
      setSales(dataArrayS);
    })();
  }, [userId]);

  return (
    <UserIdContext.Provider value={userId}>
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
                  hoverBackgroundColor: "blue",
                  barPercentage: 1,
                },
                {
                  label: "Sales",
                  data: [
                    sales[0].monthlySales.$numberDecimal,
                    sales[1].monthlySales.$numberDecimal,
                  ],
                  hoverBackgroundColor: "red",
                  barPercentage: 1,
                },
              ],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        )}
      </section>
    </UserIdContext.Provider>
  );
};

export default Dashboard;
