import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { Chart } from "chart.js";
import "chartjs-adapter-moment";
import UserIdContext from "./UserIdContext";
import DurationSelecter from "../../component/field-filter/DurationSelecter.jsx";

const LineChart = (t) => {
  const { type } = t;
  const today = new Date();
  const thisYear = today.toLocaleDateString().split("/")[2];
  const thisMonth = today.toLocaleDateString().split("/")[0].padStart(2, "0");
  const userId = useContext(UserIdContext);
  const [retrievedData, setRetrievedData] = useState([]);
  const [durationType, setDurationType] = useState("yearly");
  const [durationValue, setDurationValue] = useState(thisYear);
  const chartRef = useRef(null);

  // Get data from the collection
  useEffect(() => {
    if (type === "market") {
      // for market price
      axios
        .get(`http://localhost:5555/marketprice`)
        .then((res) => {
          setRetrievedData(res.data.data.docs);
        })
        .catch(console.log("waiting..."));
    } else if (type === "cashflow") {
      // for cash flow
      axios
        .get(
          `http://localhost:5555/tmpFinRoute/${userId}/currentbalance/byuser`
        )
        .then((res) => {
          setRetrievedData(res.data.data.docs);
        })
        .catch(console.log("waiting..."));
    }
  }, [type, userId]);

  useEffect(() => {
    const ctxx = chartRef.current.getContext("2d");

    const gradient = ctxx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(75, 192, 192, 0.2)");
    gradient.addColorStop(1, "rgba(75, 192, 192, 0)");

    // Generate the last 12 months dynamically
    const last12Months = Array.from({ length: 12 }, (_, i) =>
      moment().subtract(i, "months").format("MMM YYYY")
    ).reverse();

    // Generate all days for the current month
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    const daysInMonth = [];

    for (let day = startOfMonth; day <= endOfMonth; day.add(1, "day")) {
      daysInMonth.push(day.format("YYYY-MM-DD"));
    }

    // Generate the daily data based on retrievedData
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

    // Tweak corrsponding duration (range of times)
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

    const dailyDateDuration = dailyData
      .filter(durationAdjuster)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const data = {
      labels: durationType === "yearly" ? last12Months : daysInMonth,
      datasets: [
        {
          label: "Market Price",
          data: dailyDateDuration.map((point) => ({
            x: point.date,
            y: point.price,
          })),
          fill: true,
          backgroundColor: gradient,
          borderColor: "rgba(75, 192, 192, 1)",
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
          ctx.strokeStyle = "#000000";
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
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label(context) {
                const date = context.label;
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
              tooltipFormat: "yyyy-MM-dd",
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
            beginAtZero: type === "market" ? false : true, // eslint-disable-line no-unneeded-ternary
            title: {
              display: true,
              text: "",
            },
            grid: {
              display: false,
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

    // Cleanup on unmount
    return () => {
      myChart.destroy();
    };
  }, [retrievedData, type, durationType, durationValue, thisYear, thisMonth]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 justify-between">
        <p>
          {type === "cashflow" ? "Cash balance trend" : "Market Price trend"}
        </p>
        <DurationSelecter
          setDurationType={setDurationType}
          setDurationValue={setDurationValue}
          thisYear={thisYear}
          thisMonth={thisMonth}
        />
      </div>
      <canvas ref={chartRef}> </canvas>
    </div>
  );
};

export default LineChart;
