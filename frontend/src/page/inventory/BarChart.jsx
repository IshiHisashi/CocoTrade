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

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ userId, URL, setInvInfo }) => {
  const [inventoryLeft, setInventoryLeft] = useState(0);
  const [inventoryWithPending, setInventoryWithPending] = useState(0);
  const [maximumInv, setMaximumInv] = useState(0);
  // const [data, setData] = useState({});

  // Retreice info for bar chart
  useEffect(
    () => {
      // maximum capacity
      axios
        .get(`${URL}/user/${userId}/maxcap`)
        .then((res) => {
          setMaximumInv(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
      // Current inventory
      axios
        .get(`${URL}/user/${userId}/latestInv`)
        .then((res) => {
          setInventoryLeft(res.data.latestInv[0].current_amount_left.$numberDecimal);
          console.log("Inv left: ",res.data.latestInv[0].current_amount_left.$numberDecimal);
          setInventoryWithPending(res.data.latestInv[0].current_amount_with_pending.$numberDecimal);
          console.log("Inv with pending: ", res.data.latestInv[0].current_amount_with_pending.$numberDecimal)
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inventoryLeft]
  );

  useEffect(() => {
    setInvInfo([inventoryWithPending, maximumInv]);
  }, [inventoryWithPending, maximumInv, setInvInfo])

  const data = {
    labels: [""],
    datasets: Number(inventoryWithPending - inventoryLeft) !== 0 ? [
      {
        label: "Stored",
        data: [(inventoryLeft / maximumInv) * 100],
        backgroundColor: "#FF8340",
        barThickness: 40,
        borderWidth: 0,
        borderSkipped: false,
        borderRadius: {
          topLeft: 30,
          bottomLeft: 30
        },
      },
      {
        label: "To ship",
        data: [((inventoryWithPending - inventoryLeft) / maximumInv) * 100],
        backgroundColor: "#245E66",
        barThickness: 40,
        borderWidth: 0,
      },
      {
        label: "Available",
        data: [((maximumInv - inventoryLeft - inventoryWithPending) / maximumInv) * 100],
        backgroundColor: "#D3D3D3",
        barThickness: 40,
        borderWidth: 0,
        borderRadius: {
          topRight: 30,
          bottomRight: 30
        }
      },
    ] :
    [
      {
        label: "Stored",
        data: [(inventoryLeft / maximumInv) * 100],
        backgroundColor: "#FF8340",
        barThickness: 40,
        borderWidth: 0,
        borderSkipped: false,
        borderRadius: {
          topLeft: 30,
          bottomLeft: 30
        },
      },
      {
        label: "Available",
        data: [((maximumInv - inventoryLeft - inventoryWithPending) / maximumInv) * 100],
        backgroundColor: "#D3D3D3",
        barThickness: 40,
        borderWidth: 0,
        borderRadius: {
          topRight: 30,
          bottomRight: 30
        }
      },
    ]
    ,
  };

  const options = {
    indexAxis: "y",
    layout: {
      padding: {
        left: -10,
        bottom: -10,
        top: 0
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        // offset: false,
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
          display: false
        }
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
          display: false
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const value = dataset.data[tooltipItem.dataIndex];
            return `${dataset.label}: ${value.toFixed(2)} %`;
          }
        }
      },
    },
    chartArea: {
      backgroundColor: 'transparent',
    },
  };

  return (
    <div className="h-[80px]">
    {/* <div className="h-[40px] rounded-3xl overflow-hidden border-2"> */}
      <Bar data={data} options={options}/>
    </div>
  );
};

export default BarChart;
