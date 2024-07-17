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
import Info from "../../assets/icons/Information.svg";
import InfoTooltip from "../../component/tooltip/InfoTooltip.jsx";
import Add from "../../assets/icons/Add.svg";

ChartJS.register(ArcElement, Tooltip, Legend);

const today = new Date();

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
  try {
    const [purchaseRes, salesRes] = await Promise.all([
      axios.get(`${URL}/tmpFinRoute/${userId}/purchase/monthly-aggregate`),
      axios.get(`${URL}/tmpFinRoute/${userId}/sale/monthly-aggregate`),
    ]);

    const purchaseResArray = purchaseRes.data.data.purchaseAggregation;
    const salesResArray = salesRes.data.data.salesAggregation;

    const [secondLatestDate, latestDate] = getLatestDate(
      purchaseResArray.length
        ? purchaseResArray[purchaseResArray.length - 1]._id.year
        : today.getFullYear(),
      purchaseResArray.length
        ? purchaseResArray[purchaseResArray.length - 1]._id.month
        : today.getMonth() + 1,
      salesResArray.length
        ? salesResArray[salesResArray.length - 1]._id.year
        : today.getFullYear(),
      salesResArray.length
        ? salesResArray[salesResArray.length - 1]._id.month
        : today.getMonth() + 1
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
      // const today = new Date();
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
  const [todaysInventory, setTodaysInventory] = useState(
    "getting your today's inventory amount..."
  );
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
  }, [userId, URL]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${URL}/user/${userId}/latestInv`);
        const formatted = Number(
          res.data.latestInv[0].current_amount_left.$numberDecimal
        ).toLocaleString();
        setTodaysInventory(`Today's inventory is ${formatted}kg`);
      } catch (error) {
        if (error.respose.status === 404) {
          setTodaysInventory(
            "Something went wrong while getting your today's inventory amount :("
          );
        }
      }
    })();
  }, [userId, URL]);

  return (
    <UserIdContext.Provider value={userId}>
      <div className="sm:m-8">
        <div className="flex justify-between items-center px-8 pb-4 sm:px-0">
          <div className="flex items-center">
            <p className="p18-bold text-neutral-600 sm:text-base md:p18-bold">
              {!upcomingShipDate
                ? "getting your upcoming shipment information..."
                : upcomingShipDate}
            </p>

            <InfoTooltip
              title="View shipment on Sales."
              placement="right"
              arrow
            >
              <button
                type="button"
                className="mx-2"
                onClick={() => navigate("/sales")}
              >
                <img src={Info} alt="toggle tooltip" className="inline-block" />
              </button>
            </InfoTooltip>
          </div>
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Add Purchase"
            onClickFnc={() =>
              navigate("/purchase", { state: { showAddForm: true } })
            }
            imgSource={Add}
          />
        </div>

        <section className="grid @2xl:grid-cols-2 gap-4">
          <PriceIndicatorCard type="market" URL={URL} />
          <PriceIndicatorCard type="suggestion" URL={URL} />
        </section>

        <section className="p-8 my-4 bg-white sm:rounded-lg sm:border sm:border-bluegreen-200">
          <LineChartRevised
            userId={userId}
            dashboard
            URL={URL}
            chartTitle={todaysInventory}
          />
        </section>

        <div className="@3xl:grid @3xl:grid-cols-3 gap-4">
          <section className="order-2 flex flex-col gap-4 mb-4 @3xl:mb-0">
            <RecentActivityCard type="purchase" URL={URL} />
            <RecentActivityCard type="sales" URL={URL} />
          </section>

          <section className="col-span-2 p-8 bg-white sm:rounded-lg sm:border sm:border-bluegreen-200 order-1">
            <h2 className="h3-sans text-neutral-600">
              Activity this month vs last month
            </h2>
            {!data ? (
              <p>loading...</p>
            ) : (
              <Bar
                data={{
                  labels: [data.secondLatestMonthName, data.latestMonthName],
                  datasets: [
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
                      backgroundColor: "#0C7F8E",
                      hoverBackgroundColor: "#0C7F8E",
                      barPercentage: 1,
                      categoryPercentage: 0.6,
                      maxBarThickness: 32,
                    },
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
                      backgroundColor: "#FF8340",
                      hoverBackgroundColor: "#FF8340",
                      barPercentage: 1,
                      categoryPercentage: 0.6,
                      maxBarThickness: 32,
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
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback(value) {
                          const valueToShow =
                            value < 1000 ? value : `${value / 1000}k`;
                          return valueToShow;
                        },
                      },
                      grid: {
                        display: false,
                      },
                      title: {
                        display: true,
                        text: "Price (Php)",
                        align: "end",
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            )}
          </section>
        </div>
      </div>
    </UserIdContext.Provider>
  );
};

export default Dashboard;
