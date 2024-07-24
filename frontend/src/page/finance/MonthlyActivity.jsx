/* eslint-disable react/prop-types */
/* eslint-disable-next-line no-underscore-dangle */
/* eslint-disable no-plusplus */

import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { Chart, registerables } from "chart.js";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import MonthlyTable from "./MonthlyTable";

Chart.register(...registerables);

const MonthlyActivity = ({ URL }) => {
  const [monthlySale, setMonthlySale] = useState([]);
  const [monthlyPurchase, setMonthlyPurchase] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedTableMonth, setSelectedTableMonth] = useState(
    moment().format("YYYY-MM")
  );
  const userId = useContext(UserIdContext);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  // Function to determine if the screen is 'lg' or larger
  const isLgScreen = () => window.innerWidth >= 1024;

  // Read sales
  useEffect(() => {
    axios
      .get(`${URL}/tmpFinRoute/${userId}/sale/monthly-aggregate`)
      .then((res) => {
        setMonthlySale(res.data.data.salesAggregation);
      })
      .catch();
    // Read purchase
    axios
      .get(`${URL}/tmpFinRoute/${userId}/purchase/monthly-aggregate`)
      .then((res) => {
        setMonthlyPurchase(res.data.data.purchaseAggregation);
      })
      .catch();
  }, [userId, URL]);

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

    const getDisplayedData = () => {
      const displayCount = isLgScreen() ? 12 : 4;
      return {
        labels: displayLabels.slice(-displayCount),
        chartDataSale: chartDataSale.slice(-displayCount),
        chartDataPurchase: chartDataPurchase.slice(-displayCount),
      };
    };

    const {
      labels: displayedLabels,
      chartDataSale: displayedSaleData,
      chartDataPurchase: displayedPurchaseData,
    } = getDisplayedData();

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: displayedLabels,
        datasets: [
          {
            label: "Monthly Sale",
            data: displayedSaleData,
            backgroundColor: (context) => {
              const index = context.dataIndex;
              const displayCount = isLgScreen() ? 12 : 4;
              const monthIndexOffset = 12 - displayCount;
              const adjustedIndex = index + monthIndexOffset;
              const month = labels[adjustedIndex];
              return month === selectedMonth || selectedMonth === "all"
                ? "#0C7F8E"
                : "#F1F7F8";
            },
            barThickness: 15,
            barPercentage: 0.5,
          },
          {
            label: "Monthly Purchase",
            data: displayedPurchaseData,
            backgroundColor: (context) => {
              const index = context.dataIndex;
              const displayCount = isLgScreen() ? 12 : 4;
              const monthIndexOffset = 12 - displayCount;
              const adjustedIndex = index + monthIndexOffset;
              const month = labels[adjustedIndex];
              return month === selectedMonth || selectedMonth === "all"
                ? "#FF8340"
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
            ticks: {
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              callback(value) {
                const valueToShow = value === 0 ? "0" : `${value / 1000}k`;
                return valueToShow;
              },
              font: {
                size: 14, // Change this to the desired font size
              },
              color: "#9C9C9C",
            },
            grid: {
              display: false, // Disable grid lines on x-axis
            },
            border: { display: false },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            // text: "Your monthly activity",
            font: {
              size: 18,
            },
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const chartElement = elements[0];
            const displayCount = isLgScreen() ? 12 : 4;
            const monthIndexOffset = 12 - displayCount;
            const adjustedIndex = chartElement.index + monthIndexOffset;
            const clickedMonth = labels[adjustedIndex];
            if (clickedMonth !== selectedMonth) {
              setSelectedMonth(clickedMonth);
              setSelectedTableMonth(clickedMonth);
              console.log(`Selected Month: ${clickedMonth}`);
            }
          } else {
            setSelectedMonth("all");
            setSelectedTableMonth(moment().format("YYYY-MM"));
            console.log("Reverted to default");
          }
        },
      },
      plugins: [drawValues],
    });

    // Update the chart options when the screen size changes
    const handleResize = () => {
      setIsLargeScreen(isLgScreen());
      const {
        labels: updatedLabels,
        chartDataSale: updatedSaleData,
        chartDataPurchase: updatedPurchaseData,
      } = getDisplayedData();
      chartInstance.current.data.labels = updatedLabels;
      chartInstance.current.data.datasets[0].data = updatedSaleData;
      chartInstance.current.data.datasets[1].data = updatedPurchaseData;
      chartInstance.current.update();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [monthlySale, monthlyPurchase, selectedMonth, isLargeScreen]);

  return (
    <div className="lg:grid lg:grid-cols-6 gap-[14px]">
      <div className=" bg-white px-[27px] py-[25px] border border-b-0 lg:border-b-1 border-bluegreen-200 lg:col-start-1 lg:col-end-5 rounded-lg">
        <h3 className="h3-sans text-neutral-600">Your Monthly Activity</h3>
        <section className="h-[250px] mt-[30px]">
          <canvas ref={chartRef}> </canvas>
        </section>
        <div className="legend flex gap-1 items-center justify-center mt-[21px]">
          <div className="w-[20px] h-[10px] bg-bluegreen-500"> </div>
          <p className="mr-[14px] p12-medium">Sales</p>
          <div className="w-[20px] h-[10px] bg-orange-400"> </div>
          <p className="p12-medium">Purchase</p>
        </div>
      </div>
      <div className="bg-white px-[27px] py-[25px] border border-t-0 lg:border-t-1 border-bluegreen-200 lg:col-start-5 lg:col-end-7 rounded-lg">
        <MonthlyTable selectedTableMonth={selectedTableMonth} URL={URL} />
      </div>
    </div>
  );
};

export default MonthlyActivity;
