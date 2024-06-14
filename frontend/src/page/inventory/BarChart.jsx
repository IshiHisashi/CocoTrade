/* eslint-disable react/prop-types */

import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarChart = ({ userId }) => {
  const [inventory, setInventory] = useState([]);
  const [maximumInv, setMaximumInv] = useState(0);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
  [])

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        label: ["aaa"],
        datasets: [{
          label: 'Inventory',
          data: [inventory],
          backgroundColor: "#0C7F8E",
          barThickness: 30
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        },
      },
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [inventory])

  return (
    <div>
      <h2>{ userId } inventory is like this now yay!</h2>
      <canvas ref={chartRef}> </canvas>
    </div>
  )
}

export default BarChart

