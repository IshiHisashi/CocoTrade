import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PriceIndicatorCard from "../../component/card/PriceIndicatorCard.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import RecentActivityCard from "../../component/card/RecentActivityCard.jsx";
import CtaBtn from "../../component/btn/CtaBtn.jsx";
import LineChartRevised from "../inventory/LineChartRevised.jsx";

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

const getData = async (userId, URL) => {
  // 66654dc4c6e950671e988962

  try {
    const [purchaseRes, salesRes] = await Promise.all([
      axios.get(`${URL}/tmpFinRoute/${userId}/purchase/monthly-aggregate`),
      axios.get(`${URL}/tmpFinRoute/${userId}/sale/monthly-aggregate`),
    ]);

    const purchaseResArray = purchaseRes.data.data.purchaseAggregation;
    const salesResArray = salesRes.data.data.salesAggregation;

    const [secondLatestDate, latestDate] = getLatestDate(
      purchaseResArray[purchaseResArray.length - 1]._id.year,
      purchaseResArray[purchaseResArray.length - 1]._id.month,
      salesResArray[salesResArray.length - 1]._id.year,
      salesResArray[salesResArray.length - 1]._id.month
    );

    const latestMonthNum = latestDate.getMonth() + 1;
    const latestYearNum = latestDate.getFullYear();
    const secondLatestMonthNum = secondLatestDate.getMonth() + 1;
    const secondLatestYearNum = secondLatestDate.getFullYear();

    const latestPurchaseObj = purchaseResArray.find(
      (obj) =>
        obj._id.year === latestYearNum && obj._id.month === latestMonthNum
    );
    const secondLatestPurchaseObj = purchaseResArray.find(
      (obj) =>
        obj._id.year === secondLatestYearNum &&
        obj._id.month === secondLatestMonthNum
    );
    const latestSalesObj = salesResArray.find(
      (obj) =>
        obj._id.year === latestYearNum && obj._id.month === latestMonthNum
    );
    const secondLatestSalesObj = salesResArray.find(
      (obj) =>
        obj._id.year === secondLatestYearNum &&
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
  } catch (error) {
    if (error.response.status === 404) {
      const today = new Date();
      const thisMonth = today.toLocaleString("default", { month: "long" });
      const lastMonth = new Date()
        .setMonth(today.getMonth() - 1)
        .toLocaleString("default", { month: "long" });
      return {
        latestMonthName: thisMonth,
        secondLatestMonthName: lastMonth,
      };
    }
    return null;
  }
};

const Dashboard = ({ URL }) => {
  const userId = useContext(UserIdContext);
  const [data, setData] = useState(null);
  const [upcomingShipDate, setUpcomingShipDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const dataObj = await getData(userId, URL);
      setData(dataObj);
    })();
  }, [userId, URL]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${URL}/sale/latest-pending/${userId}`);
        setUpcomingShipDate(
          `You have an upcoming shipment on ${res.data.date}.`
        );
      } catch (error) {
        if (error.response.status === 404) {
          setUpcomingShipDate("You have no upcoming shipment.");
        }
      }
    })();
  });

  return (
    <UserIdContext.Provider value={userId}>
      <div className="flex justify-between items-center">
        {!upcomingShipDate ? (
          <p>getting your upcoming shipment information...</p>
        ) : (
          <p>{upcomingShipDate}</p>
        )}
        <CtaBtn
          size="M"
          level="P"
          innerTxt="Add Purchase"
          onClickFnc={() =>
            navigate("/purchase", { state: { showAddForm: true } })
          }
        />
      </div>

      <section className="grid sm:grid-cols-2">
        <PriceIndicatorCard type="market" URL={URL} />
        <PriceIndicatorCard type="suggestion" URL={URL} />
      </section>

      <section className="bg-white">
        <h2>Today&apos;s inventory is 00,000kg</h2>
        <LineChartRevised userId={userId} dashboard URL={URL} />
      </section>

      <div className="grid sm:grid-cols-3">
        <section className="col-span-2 p-4 bg-white">
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

        <section>
          <RecentActivityCard type="purchase" URL={URL} />
          <RecentActivityCard type="sales" URL={URL} />
        </section>
      </div>
    </UserIdContext.Provider>
  );
};

export default Dashboard;
