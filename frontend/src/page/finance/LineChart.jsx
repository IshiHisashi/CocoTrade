/* eslint-disable no-else-return */
/* eslint-disable spaced-comment */

import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import { Chart } from "chart.js";
import "chartjs-adapter-moment";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import DurationSelecter from "../../component/field-filter/DurationSelecter.jsx";

const LineChart = (t) => {
  const { type, URL } = t;
  const today = useMemo(() => new Date(), []);
  const thisYear = today.toLocaleDateString().split("/")[2];
  const thisMonth = today.toLocaleDateString().split("/")[0].padStart(2, "0");
  const userId = useContext(UserIdContext);
  const [retrievedData, setRetrievedData] = useState([]);
  const [durationType, setDurationType] = useState("yearly");
  const [durationValue, setDurationValue] = useState(thisYear);
  const chartRef = useRef(null);

  // Function to determine if the screen is 'lg' or larger
  const isLgScreen = () => window.innerWidth >= 1024;

  // Get data from the collection
  useEffect(() => {
    if (type === "market") {
      // for market price
      axios
        .get(`${URL}/marketprice`)
        .then((res) => {
          setRetrievedData(res.data.data.docs);
        })
        .catch(console.log("waiting..."));
    } else if (type === "cashflow") {
      console.log(userId);
      // for cash flow
      axios
        .get(`${URL}/tmpFinRoute/${userId}/currentbalance/byuser`)
        .then((res) => {
          console.log(res);
          setRetrievedData(res.data.data.docs);
        })
        .catch(console.log("waiting..."));
    }
  }, [type, userId, URL]);

  // LineChart drawing
  useEffect(() => {
    // Visual setting
    const ctxx = chartRef.current.getContext("2d");
    const gradient = ctxx.createLinearGradient(0, 0, 0, 300);
    if (type === "market") {
      gradient.addColorStop(0, "rgba(75, 192, 192, 0.5)");
      gradient.addColorStop(1, "rgba(75, 192, 192, 0)");
    } else {
      // rgba(255, 131, 64, 1)
      gradient.addColorStop(0, "rgba(255, 131, 64, 0.5)");
      gradient.addColorStop(1, "rgba(255, 131, 64, 0)");
    }

    // -----DATA processing ------
    // 1. Convert the data to simple obj array
    // 2. Set duration and convert data as per the span
    // 3. Fill in data to the days where the data doesn't exists.

    // 1. Data Simplification : Generate the daily data based on retrievedData
    const dailyData = retrievedData.map((price) => {
      const priceObj =
        type === "cashflow"
          ? {
              date: price.date.slice(0, 10),
              price: Number(price.current_balance.$numberDecimal),
            }
          : {
              date: price.createdAt.slice(0, 10),
              price: Number(price.price_PHP.$numberDecimal),
            };
      return priceObj;
    });

    // 2-1. Duration control : Tweak corrsponding duration (range of times)
    const durationAdjuster = (data) => {
      if (durationType === "yearly") {
        return moment(data.date).isAfter(moment().subtract(12, "months"));
      }
      if (durationType === "monthly") {
        return (
          data.date.slice(5, 7) === durationValue &&
          data.date.slice(0, 4) === thisYear.toString()
        );
      }
      return true;
    };

    // 2-2. Revise Array in accordance with the duration (yearly or monthly)
    const dailyDateDuration = dailyData
      .filter(durationAdjuster)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3-1. Add data to blank days. This is to make consecutive chart : Get the latest balance before the start of the duration
    const latestBalanceBeforeStart =
      dailyData
        .filter((data) =>
          moment(data.date).isBefore(dailyDateDuration[0]?.date || today)
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.price || null;

    // 3-2. Generate all days for the current month or the last 12 months
    let daysInDuration = [];
    if (durationType === "monthly") {
      // Monthly scenario
      const startOfDuration = moment().subtract(30, "days");
      const endOfDuration = moment();
      for (let day = startOfDuration; day <= endOfDuration; day.add(1, "day")) {
        daysInDuration.push(day.format("YYYY-MM-DD"));
      }
      // Ensure each day in the current month has a corresponding data point
      let lastPrice = latestBalanceBeforeStart;
      daysInDuration = daysInDuration.map((day) => {
        const dataPoint = dailyDateDuration.find((data) => data.date === day);
        if (moment(day).isBefore(dailyDateDuration[0]?.date)) {
          return { date: day, price: latestBalanceBeforeStart }; //inherit the initial value
        } else if (moment(day).isAfter(today)) {
          return { date: day, price: null }; // if the blank day is in the future, leave it null.
        } else if (!dataPoint) {
          return { date: day, price: lastPrice }; // If the transaction doesn't occur. just refer to the day before.
        } else {
          lastPrice = dataPoint.price;
          return { date: day, price: dataPoint.price }; //If transaction occurs, the value of the day should change
        }
      });
    } else if (durationType === "yearly") {
      // Yearly scenario
      const startOfDuration = moment().subtract(12, "months").startOf("month");
      const endOfDuration = moment().endOf("month");
      for (let day = startOfDuration; day <= endOfDuration; day.add(1, "day")) {
        daysInDuration.push(day.format("YYYY-MM-DD"));
      }
      // Ensure each day in the last 12 months has a corresponding data point
      let lastPrice = latestBalanceBeforeStart;
      daysInDuration = daysInDuration.map((day) => {
        const dataPoint = dailyDateDuration.find((data) => data.date === day);
        if (moment(day).isBefore(dailyDateDuration[0]?.date)) {
          return { date: day, price: latestBalanceBeforeStart };
        } else if (moment(day).isAfter(today)) {
          return { date: day, price: null };
        } else if (!dataPoint) {
          return { date: day, price: lastPrice };
        } else {
          lastPrice = dataPoint.price;
          return { date: day, price: dataPoint.price };
        }
      });
    }

    daysInDuration = daysInDuration.filter((point) =>
      moment(point.date).isBefore(today)
    );

    const data = {
      labels: daysInDuration.map((dayOrMonth) => dayOrMonth.date),
      datasets: [
        {
          label: "Market Price",
          data: daysInDuration.map((point) => ({
            x: point.date,
            y: point.price,
          })),
          fill: true,
          backgroundColor: gradient,
          borderColor:
            type === "market"
              ? "rgba(75, 192, 192, 1)"
              : "rgba(255, 131, 64, 1)",
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    };

    const verticalLinePlugin = {
      id: "verticalLinePlugin",
      beforeDraw: (chart) => {
        // eslint-disable-next-line no-underscore-dangle
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const {
            ctx,
            scales: {
              y: { top: topY, bottom: bottomY },
            },
            tooltip: {
              _active: [
                {
                  element: { x },
                },
              ],
            },
          } = chart;

          ctx.save();

          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle =
            type === "market"
              ? "rgba(75, 192, 192, 1)"
              : "rgba(255, 131, 64, 1";
          ctx.stroke();
          ctx.restore();
        }
      },
    };

    const config = {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label(context) {
                const date = context.raw.x;
                const price = context.raw.y;
                return `Php ${price.toFixed(2)}`;
              },
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: durationType === "yearly" ? "month" : "day",
              tooltipFormat: "MM/DD/YYYY",
              displayFormats: {
                month: "MM/YY",
                day: "MM/DD",
              },
              min: daysInDuration[0].date, // Set the minimum date
              max: daysInDuration[daysInDuration.length - 1].date, // Set the maximum date to remove the gap
            },
            title: {
              display: false,
              text: durationType === "yearly" ? "month" : "day",
            },
            grid: {
              display: false,
            },
          },
          y: {
            display: isLgScreen(),
            beginAtZero: type === "market" ? false : true, // eslint-disable-line no-unneeded-ternary
            title: {
              display: true,
              text: "",
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              callback(value) {
                const valueToShow = value === 0 ? "0" : `${value / 1000}k`;
                return valueToShow;
              },
            },
          },
        },
        elements: {
          line: {
            tension: 0.4, // Smoothing effect
          },
          point: {
            radius: 0, // Hide points
          },
        },
      },
      plugins: [verticalLinePlugin],
    };

    const myChart = new Chart(ctxx, config);

    // Update the chart options when the screen size changes
    const handleResize = () => {
      myChart.options.scales.y.display = isLgScreen();
      myChart.update();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.destroy();
    };
  }, [
    retrievedData,
    type,
    durationType,
    durationValue,
    thisYear,
    thisMonth,
    today,
  ]);

  return (
    <div className="flex flex-col gap-8 bg-white px-[27px] py-[25px] border border-bluegreen-200 rounded-lg ">
      <div className="flex gap-4 justify-between">
        <h3 className="h3-sans text-neutral-600">
          {type === "cashflow" ? "Balance" : "Market Price Tracker"}
        </h3>
        <DurationSelecter
          setDurationType={setDurationType}
          setDurationValue={setDurationValue}
          thisYear={thisYear}
          thisMonth={thisMonth}
        />
      </div>
      <div className="h-[200px]">
        <canvas ref={chartRef}> </canvas>
      </div>
    </div>
  );
};

export default LineChart;
