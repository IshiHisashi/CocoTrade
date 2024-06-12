import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const LineChart = () => {
  const [marketPrice, setMarketPrice] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Ref to hold the chart instance

  // Get market price from the collection
  useEffect(() => {
    axios
      .get(`http://localhost:5555/marketprice`)
      .then((res) => {
        console.log(res.data.data.docs);
        setMarketPrice(res.data.data.docs);
      })
      .catch(console.log("waiting..."));
  }, []);

  //   for line chart
  useEffect(() => {
    const ctxx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy existing chart instance
    }

    const gradient = ctxx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(75, 192, 192, 0.2)");
    gradient.addColorStop(1, "rgba(75, 192, 192, 0)");

    const chartData = [
      { date: "May 2023", price: 35.05 },
      { date: "Jun 2023", price: 35.25 },
      { date: "Jul 2023", price: 36.0 },
      { date: "Aug 2023", price: 36.5 },
      { date: "Sep 2023", price: 36.75 },
      { date: "Oct 2023", price: 36.5 },
      { date: "Nov 2023", price: 35.25 },
      { date: "Dec 2023", price: 35.5 },
      { date: "Jan 2024", price: 35.75 },
      { date: "Feb 2024", price: 35.25 },
      { date: "Mar 2024", price: 35.5 },
      { date: "Apr 2024", price: 35.75 },
      { date: "May 2024", price: 35.5 },
    ];

    const data = {
      labels: chartData.map((item) => item.date),
      datasets: [
        {
          label: "Market Price",
          data: chartData.map((item) => item.price),
          fill: true,
          backgroundColor: gradient,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.4,
          pointRadius: 0, // Remove points
        },
      ],
    };

    const config = {
      type: "line",
      data,
      options: {
        interaction: {
          mode: "index", // Display tooltip for the nearest data point along the x-axis
          intersect: false, // Tooltip appears even if not directly over a data point
        },
        plugins: {
          tooltip: {
            intersect: false,
            callbacks: {
              label(context) {
                const label = context.dataset.label || "";
                const value = context.raw || "";
                return `${label}: Php ${value}`;
              },
              title(context) {
                return context[0].label;
              },
            },
          },
          crosshairLine: {
            lineColor: "rgba(0, 0, 0, 0.8)",
            lineWidth: 1,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
            grid: {
              display: false, // Remove grid lines
            },
          },
          y: {
            title: {
              display: true,
              text: "Price (Php)",
            },
            grid: {
              display: false, // Remove grid lines
            },
            beginAtZero: false,
          },
        },
        elements: {
          point: {
            radius: 0, // Hide points on the line
          },
          line: {
            borderWidth: 2, // Line thickness
          },
        },
      },
      plugins: [
        {
          id: "crosshairLine",
          beforeDraw: (chart) => {
            const tooltipItems = chart.tooltip?.getActiveElements();
            if (tooltipItems?.length) {
              const [
                {
                  element: { x },
                },
              ] = tooltipItems; // Destructure to avoid dangling underscore
              const {
                ctx,
                scales: {
                  y: { top: topY, bottom: bottomY },
                },
              } = chart; // Destructure ctx and scales

              ctx.save();
              ctx.beginPath();
              ctx.moveTo(x, topY);
              ctx.lineTo(x, bottomY);
              ctx.lineWidth =
                chart.config.options.plugins.crosshairLine.lineWidth;
              ctx.strokeStyle =
                chart.config.options.plugins.crosshairLine.lineColor;
              ctx.stroke();
              ctx.restore();
            }
          },
        },
      ],
    };

    chartInstanceRef.current = new Chart(ctxx, config);
  }, []);

  return (
    <div>
      LineChart
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart;
