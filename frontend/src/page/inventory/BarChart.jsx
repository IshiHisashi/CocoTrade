/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useLoading } from "../../contexts/LoadingContext.jsx";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ userId, URL, setInvInfo, showModal }) => {
  const [inventoryLeft, setInventoryLeft] = useState(0);
  const [inventoryWithPending, setInventoryWithPending] = useState(0);
  const [maximumInv, setMaximumInv] = useState(0);
  const { startLoading, stopLoading } = useLoading();
  const [load, setLoad] = useState(null);
  // const [data, setData] = useState({});

  // Retreice info for bar chart
  useEffect(
    () => {
      startLoading();
      // maximum capacity
      axios
        .get(`${URL}/user/${userId}/maxcap`)
        .then((res) => {
          setMaximumInv(res.data.data);
          stopLoading();
        })
        .catch((err) => {
          console.error(err);
        });
      // Current inventory
      axios
        .get(`${URL}/user/${userId}/latestInv`)
        .then((res) => {
          setInventoryLeft(
            res.data.latestInv[0].current_amount_left.$numberDecimal
          );
          setInventoryWithPending(
            res.data.latestInv[0].current_amount_with_pending.$numberDecimal
          );
          stopLoading();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, URL, showModal, startLoading, stopLoading]
  );

  useEffect(() => {
    setInvInfo([inventoryWithPending, maximumInv]);
  }, [inventoryWithPending, maximumInv, setInvInfo]);

  const data = {
    labels: [""],
    datasets:
      Number(inventoryWithPending - inventoryLeft) !== 0
        ? [
            {
              label: "Stored",
              data: [(inventoryLeft / maximumInv) * 100],
              backgroundColor: "#FF5B04",
              barThickness: 20,
              borderWidth: 0,
              borderSkipped: false,
              borderRadius: {
                topLeft: 10,
                bottomLeft: 10,
              },
            },
            {
              label: "To ship",
              data: [
                ((inventoryWithPending - inventoryLeft) / maximumInv) * 100,
              ],
              backgroundColor: "#0C7F8E",
              barThickness: 20,
              borderWidth: 0,
            },
            {
              label: "Available",
              data: [((maximumInv - inventoryWithPending) / maximumInv) * 100],
              backgroundColor: "#F1F1F1",
              barThickness: 20,
              borderWidth: 1,
              borderColor: "#D3D3D3",
              borderRadius: {
                topRight: 10,
                bottomRight: 10,
              },
            },
          ]
        : [
            {
              label: "Stored",
              data: [(inventoryLeft / maximumInv) * 100],
              backgroundColor: "#FF5B04",
              barThickness: 20,
              borderWidth: 0,
              borderSkipped: false,
              borderRadius: {
                topLeft: 10,
                bottomLeft: 10,
              },
            },
            {
              label: "Available",
              data: [((maximumInv - inventoryWithPending) / maximumInv) * 100],
              backgroundColor: "#F1F1F1",
              barThickness: 20,
              borderWidth: 1,
              borderColor: "#D3D3D3",
              borderRadius: {
                topRight: 10,
                bottomRight: 10,
              },
            },
          ],
  };

  const options = {
    indexAxis: "y",
    layout: {
      padding: {
        left: -8,
        bottom: 0,
        top: 16,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          display: false,
        },
        beginAtZero: true,
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "start",
        onClick: () => {},
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const value = dataset.data[tooltipItem.dataIndex];
            return `${dataset.label}: ${value.toFixed(2)} %`;
          },
        },
        yAlign: "bottom",
      },
      verticalLinePlugin: false,
    },
    chartArea: {
      backgroundColor: "transparent",
    },
  };

  return (
    <div className="h-[80px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
