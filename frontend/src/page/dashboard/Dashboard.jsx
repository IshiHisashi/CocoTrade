import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import PriceIndicatorCard from "../../component/card/PriceIndicatorCard.jsx";
import UserIdContext from "./UserIdContext.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

// get the latest month among the purchase and sales logs.
const getLatestDate = (
  purchaseYear,
  purchaseMonthNum,
  salesYear,
  salesMonthNum
) => {
  const purchaseDate = new Date(purchaseYear, purchaseMonthNum - 1, 1);
  const salesDate = new Date(salesYear, salesMonthNum - 1, 1);

  if (purchaseDate > salesDate) {
    return [new Date(purchaseDate - 1), purchaseDate];
  }
  return [new Date(salesDate - 1), salesDate];
};

const getData = async (userId) => {
  // 66654dc4c6e950671e988962

  const [purchaseRes, salesRes] = await Promise.all([
    axios.get(
      `http://localhost:5555/tmpFinRoute/${userId}/purchase/monthly-aggregate`
    ),
    axios.get(
      `http://localhost:5555/tmpFinRoute/${userId}/sale/monthly-aggregate`
    ),
  ]);

  const purchaseResArray = purchaseRes.data.data.purchaseAggregation;
  const salesResArray = salesRes.data.data.salesAggregation;

  const [secondLatestDate, latestDate] = getLatestDate(
    // eslint-disable-next-line no-underscore-dangle
    purchaseResArray[purchaseResArray.length - 1]._id.year,
    // eslint-disable-next-line no-underscore-dangle
    purchaseResArray[purchaseResArray.length - 1]._id.month,
    // eslint-disable-next-line no-underscore-dangle
    salesResArray[salesResArray.length - 1]._id.year,
    // eslint-disable-next-line no-underscore-dangle
    salesResArray[salesResArray.length - 1]._id.month
  );

  const latestMonthNum = latestDate.getMonth() + 1;
  const latestYearNum = latestDate.getFullYear();
  const secondLatestMonthNum = secondLatestDate.getMonth() + 1;
  const secondLatestYearNum = secondLatestDate.getFullYear();

  const latestPurchaseObj = purchaseResArray.find(
    // eslint-disable-next-line no-underscore-dangle
    (obj) => obj._id.year === latestYearNum && obj._id.month === latestMonthNum
  );
  const secondLatestPurchaseObj = purchaseResArray.find(
    (obj) =>
      // eslint-disable-next-line no-underscore-dangle
      obj._id.year === secondLatestYearNum &&
      // eslint-disable-next-line no-underscore-dangle
      obj._id.month === secondLatestMonthNum
  );
  const latestSalesObj = salesResArray.find(
    // eslint-disable-next-line no-underscore-dangle
    (obj) => obj._id.year === latestYearNum && obj._id.month === latestMonthNum
  );
  const secondLatestSalesObj = salesResArray.find(
    (obj) =>
      // eslint-disable-next-line no-underscore-dangle
      obj._id.year === secondLatestYearNum &&
      // eslint-disable-next-line no-underscore-dangle
      obj._id.month === secondLatestMonthNum
  );

  return {
    latestMonthName: latestDate.toLocaleString("default", { month: "long" }),
    secondLatestMonthName: secondLatestDate.toLocaleString("default", {
      month: "long",
    }),
    purchase: {
      latest: latestPurchaseObj,
      secondLatest: secondLatestPurchaseObj,
    },
    sales: {
      latest: latestSalesObj,
      secondLatest: secondLatestSalesObj,
    },
  };
};

const Dashboard = () => {
  const userId = useContext(UserIdContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const dataObj = await getData(userId);
      setData(dataObj);
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
        <h2>Activity this month vs last month</h2>
        {!data ? (
          <p>loading...</p>
        ) : (
          <Bar
            data={{
              labels: [data.secondLatestMonthName, data.latestMonthName],
              datasets: [
                {
                  label: "Purchase",
                  data: [
                    data.purchase.secondLatest
                      ? data.purchase.secondLatest.monthlyPurchase
                          .$numberDecimal
                      : 0,
                    data.purchase.latest
                      ? data.purchase.latest.monthlyPurchase.$numberDecimal
                      : 0,
                  ],
                  hoverBackgroundColor: "blue",
                  barPercentage: 1,
                },
                {
                  label: "Sales",
                  data: [
                    data.sales.secondLatest
                      ? data.sales.secondLatest.monthlySales.$numberDecimal
                      : 0,
                    data.sales.latest
                      ? data.sales.latest.monthlySales.$numberDecimal
                      : 0,
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
