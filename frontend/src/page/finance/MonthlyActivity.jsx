/* eslint-disable react/prop-types */
/* eslint-disable-next-line no-underscore-dangle */
/* eslint-disable no-plusplus */

import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { Chart, registerables } from "chart.js";
import UserIdContext from "./UserIdContext";
import MonthlyTable from "./MonthlyTable";

Chart.register(...registerables);

const MonthlyActivity = () => {
  const [monthlySale, setMonthlySale] = useState([]);
  const [monthlyPurchase, setMonthlyPurchase] = useState([]);

  const userId = useContext(UserIdContext);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Read sales
  useEffect(() => {
    axios
      .get(`http://localhost:5555/tmpFinRoute/${userId}/sale/monthly-aggregate`)
      .then((res) => {
        setMonthlySale(res.data.data.salesAggregation);
      })
      .catch();
    // Read purchas
    axios
      .get(
        `http://localhost:5555/tmpFinRoute/${userId}/purchase/monthly-aggregate`
      )
      .then((res) => {
        setMonthlyPurchase(res.data.data.purchaseAggregation);
      })
      .catch();
  }, [userId]);

  function getLast12Months() {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(moment().subtract(i, "months").format("MMM YYYY"));
    }
    return months.reverse(); // To get them in chronological order
  }
  //   For Graph
  useEffect(() => {
    const labels = getLast12Months();
    const chartDataSale = new Array(12).fill(null);
    const chartDataPurchase = new Array(12).fill(null);

    // Make an array to list the last 12 months data
    const months = [];
    for (let i = 11; i >= 0; i--) {
      months.push(moment().subtract(i, "months").format("YYYY-MM"));
    }
    const findMonthIndex = (month, year) => {
      const monthYearString = `${year}-${String(month).padStart(2, "0")}`;
      return months.indexOf(monthYearString);
    };

    monthlySale.forEach((item) => {
      // eslint-disable-next-line no-underscore-dangle
      const monthIndex = findMonthIndex(item._id.month, item._id.year);
      if (monthIndex !== -1) {
        chartDataSale[monthIndex] =
          +item.monthlySales.$numberDecimal.toString();
      }
    });
    monthlyPurchase.forEach((item) => {
      // eslint-disable-next-line no-underscore-dangle
      const monthIndex = findMonthIndex(item._id.month, item._id.year);
      if (monthIndex !== -1) {
        chartDataPurchase[monthIndex] =
          +item.monthlyPurchase.$numberDecimal.toString();
      }
    });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Monthly Sale",
            data: chartDataSale,
            backgroundColor: "#F1F7F8",
            hoverBackgroundColor: "#245E66",
            barThickness: 15,
          },
          {
            label: "Monthly Purchase",
            data: chartDataPurchase,
            backgroundColor: "#F1F7F8",
            hoverBackgroundColor: "#0C7F8E",
            barThickness: 15,
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: false,
            // Controls the space between bars within a group
            barPercentage: 0.8,
            // Controls the space between categories (groups of bars)
            categoryPercentage: 0.3,
            grid: {
              display: false, // Disable grid lines on x-axis
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback(value) {
                return `${value / 1000}k`; // Use template literals
              },
            },
            grid: {
              display: false, // Disable grid lines on x-axis
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Your monthly activity",
            font: {
              size: 18,
            },
          },
        },
      },
    });
  }, [monthlySale, monthlyPurchase]);

  return (
    <div>
      <h1>MonthlyActivity</h1>
      <canvas ref={chartRef}> </canvas>
      <MonthlyTable />
      {console.log(monthlySale)}
    </div>
  );
};

export default MonthlyActivity;
