import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js";
import "chartjs-adapter-moment";

const LineChart = ({ userId }) => {
  // const { type } = t;
  const type = "cashflow";
  const [marketPrice, setMarketPrice] = useState([]);
  const chartRef = useRef(null);

  // Get market price from the collection
  useEffect(() => {
    console.log(type);
    if (type === "market") {
      // for market price
      axios
        .get(`http://localhost:5555/marketprice`)
        .then((res) => {
          console.log(res.data.data.docs);
          setMarketPrice(res.data.data.docs);
        })
        .catch(console.log("waiting..."));
    } else if (type === "cashflow") {
      // for cash flow
      console.log(userId);
      console.log("coming soon...");
    }
  }, [type, userId]);

  useEffect(() => {
    const ctxx = chartRef.current.getContext("2d");

    const gradient = ctxx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(75, 192, 192, 0.2)");
    gradient.addColorStop(1, "rgba(75, 192, 192, 0)");

    const dailyData = marketPrice.map((price) => {
      const priceObj = {
        date: price.createdAt.slice(0, 10),
        price: Number(price.price_PHP.$numberDecimal),
      };
      return priceObj;
    });

    const data = {
      labels: [
        "Jan 2024",
        "Feb 2024",
        "Mar 2024",
        "Apr 2024",
        "May 2024",
        "Jun 2024",
        "Jul 2024",
        "Aug 2024",
        "Sep 2024",
        "Oct 2024",
        "Nov 2024",
        "Dec 2024",
      ],
      datasets: [
        {
          label: "Market Price",
          data: dailyData.map((point) => ({ x: point.date, y: point.price })),
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
              unit: "month",
              tooltipFormat: "yyyy-MM-dd",
            },
            title: {
              display: true,
              text: "Month",
            },
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: "Price",
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
  }, [marketPrice]);

  return (
    <div className="flex flex-col gap-8">
      <p>Market Price trend </p>
      <canvas ref={chartRef}> </canvas>
    </div>
  );
};

export default LineChart;
