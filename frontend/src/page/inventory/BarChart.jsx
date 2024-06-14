/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js/auto';

const BarChart = ({ userId }) => {
  const [inventory, setInventory] = useState([]);
  const [maximumInv, setMaximumInv] = useState(0);

  // Retreice info for bar chart
  useEffect(() => {
    axios
      .get(`http://localhost:5555/user/${userId}/inv`)
      .then((res) => {
          setMaximumInv(res.data.data.max_amount);
          setInventory(res.data.data.inventory);
          console.log(res.data.data);
      })
      .catch((err) => {
          console.error(err);
      })
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])
  return (
    <div>
      Barchart here
      <h2>{ userId }</h2>
    </div>
  )
}

export default BarChart

