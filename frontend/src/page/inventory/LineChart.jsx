import React, { useState, useEffect }  from 'react';
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ userId }) => {

  const [inventory, setInventory] = useState([]);
  const today = new Date();
  const todayISO = today.toISOString();
  const aYearAgo = new Date(today.setYear(today.getFullYear() - 1));
  const aYearAgoISO = aYearAgo.toISOString();
  const [startDate, setStartDate] = useState(aYearAgoISO);
  const [endDate, setEndDate] = useState(todayISO);

  useEffect(() => {
    // Current inventory
    axios
    .get(`http://localhost:5555/user/${userId}/invd?start=${startDate}&end=${endDate}`)
    .then((res) => {
        // setMaximumInv(res.data.data.max_amount);
        setInventory(res.data.data);
        console.log(res.data.data);
    })
    .catch((err) => {
        console.error(err);
    });
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [startDate, endDate])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const last12Months = [];

  for (let i = 0; i < 12; ) {
    const monthIndex = (currentMonth + 1 + i) % 12;
    const year = currentYear - Math.floor((currentMonth - i) / 12);
    last12Months.push(`${months[monthIndex]}/${year}`);
    i += 1;
  }

  const dataPoints = inventory.map(item => item.current_amount.$numberDecimal);
  console.log(dataPoints);

  console.log(last12Months);

  const data = {
    labels: last12Months,
    datasets: [
      {
        lebel: `Inventory from ${startDate} to ${endDate}`,
        data: dataPoints,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'amount',
        },
        beginAtZero: true,
      },
      grid: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory history',
      },
    },
  };

  return (
    <div>
      <p>Start Date: { startDate }</p>
      <p>End Date: { endDate }</p>
      {/* <Line data={ data } options={ options } /> */}
    </div>
  )
}

export default LineChart
