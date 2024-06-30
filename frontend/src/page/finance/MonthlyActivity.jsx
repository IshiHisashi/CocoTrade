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
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedTableMonth, setSelectedTableMonth] = useState(
    moment().format("YYYY-MM")
  );
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
    // Read purchase
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
      months.push(moment().subtract(i, "months").format("YYYY-MM"));
    }
    return months.reverse(); // To get them in chronological order
  }

  function getLast12MonthsDisplay() {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(moment().subtract(i, "months").format("MM/YY"));
    }
    return months.reverse(); // To get them in chronological order
  }

  //   For Graph
  useEffect(() => {
    const labels = getLast12Months();
    const displayLabels = getLast12MonthsDisplay();
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

    const drawValues = {
      id: "drawValues",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.hidden) {
            meta.data.forEach((element, index) => {
              // Draw the text in black, with the specified font
              ctx.fillStyle = "black";
              ctx.font = "bold 12px Arial";

              const dataString = dataset.data[index]
                ? `${Math.round(Number(dataset?.data[index]) / 1000)}K`
                : "";
              // Make sure alignment settings are correct
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              const padding = 5;
              const position = element.tooltipPosition();
              ctx.fillText(
                dataString,
                position.x,
                position.y - 12 / 2 - padding
              );
            });
          }
        });
      },
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: displayLabels,
        datasets: [
          {
            label: "Monthly Sale",
            data: chartDataSale,
            backgroundColor: (context) => {
              const index = context.dataIndex;
              const month = labels[index];
              return month === selectedMonth || selectedMonth === "all"
                ? "#245E66"
                : "#F1F7F8";
            },
            barThickness: 15,
            barPercentage: 0.5,
          },
          {
            label: "Monthly Purchase",
            data: chartDataPurchase,
            backgroundColor: (context) => {
              const index = context.dataIndex;
              const month = labels[index];
              return month === selectedMonth || selectedMonth === "all"
                ? "#0C7F8E"
                : "#F1F7F8";
            },
            barThickness: 15,
            barPercentage: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
            // Controls the space between bars within a group
            barPercentage: 0.4,
            // Controls the space between categories (groups of bars)
            categoryPercentage: 0.5,
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
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const chartElement = elements[0];
            const clickedMonth = labels[chartElement.index];
            setSelectedMonth(clickedMonth);
            setSelectedTableMonth(clickedMonth);
            console.log(`Selected Month: ${clickedMonth}`);
          }
        },
      },
      plugins: [drawValues],
    });
  }, [monthlySale, monthlyPurchase, selectedMonth]);

  return (
    <div>
      <h1>MonthlyActivity</h1>
      <div className="grid grid-cols-[80%_20%]">
        <section>
          <canvas ref={chartRef} className="">
            {" "}
          </canvas>
        </section>
        <MonthlyTable selectedTableMonth={selectedTableMonth} />
      </div>
    </div>
  );
};

export default MonthlyActivity;
