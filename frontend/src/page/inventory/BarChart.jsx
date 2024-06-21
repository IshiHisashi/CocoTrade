/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend  } from 'chart.js';
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const BarChart = ({ userId }) => {
  const [inventory, setInventory] = useState([]);
  const [maximumInv, setMaximumInv] = useState(0);
  // const [data, setData] = useState({});

  // Retreice info for bar chart
  useEffect(() => {

    // maximum capacity
    axios
      .get(`http://localhost:5555/user/${userId}/maxcap`)
      .then((res) => {
          setMaximumInv(res.data.data);
          console.log(res.data.data);
      })
      .catch((err) => {
          console.error(err);
      });
    // Current inventory
    axios
    .get(`http://localhost:5555/user/${userId}/inv`)
    .then((res) => {
        // setMaximumInv(res.data.data.max_amount);
        setInventory(res.data.data[0].current_amount.$numberDecimal);
        console.log(res.data.data[0].current_amount.$numberDecimal);
    })
    .catch((err) => {
        console.error(err);
    });
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [inventory])

  const data = {
    labels: [""],
    datasets: [{
      label: 'Current Inventory',
      data: [inventory],
      backgroundColor: "#0C7F8E",
      barThickness: 60
    }],
  }

  const options =  {
    indexAxis: 'y',
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        max: maximumInv,
        beginAtZero: true,
        grid: {
          display: false
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Your Inventory Capacity",
        font: {
          size: 20,
        },
      },
      customCanvasHeight: {
        height: "150px"
      }
    },
  }

  return (
    <div>
      <Bar data={ data } options={ options }/>
      
    </div>
  )
}

export default BarChart

