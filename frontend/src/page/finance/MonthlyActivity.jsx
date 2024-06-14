/* eslint-disable react/prop-types */
// eslint-disable-next-line no-underscore-dangle
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import UserIdContext from "./UserIdContext";

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

  //   For Graph
  useEffect(() => {
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartDataSale = new Array(12).fill(null);
    const chartDataPurchase = new Array(12).fill(null);
    monthlySale.forEach((item) => {
      // eslint-disable-next-line no-underscore-dangle
      const monthIndex = item._id.month - 1; // MongoDB month is 1-indexed
      chartDataSale[monthIndex] = +item.monthlySales.$numberDecimal.toString();
    });
    monthlyPurchase.forEach((item) => {
      // eslint-disable-next-line no-underscore-dangle
      const monthIndex = item._id.month - 1; // MongoDB month is 1-indexed
      chartDataPurchase[monthIndex] =
        +item.monthlyPurchase.$numberDecimal.toString();
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
          //   datalabels: {
          //     display: true,
          //     align: "end",
          //     anchor: "end",
          //     formatter: (value) => {
          //       return `${value / 1000}k`; // Format the value
          //     },
          //   },
        },
      },
    });
  }, [monthlySale, monthlyPurchase]);

  return (
    <div>
      <h1>MonthlyActivity</h1>
      <canvas ref={chartRef}> </canvas>
    </div>
  );
};

export default MonthlyActivity;
