import React, { useState, useEffect } from 'react'
import axios from 'axios';

const SalesTable = ({ userId }) => {

  const [sales, setSales] = useState([]);
  
  useEffect(() => {
    axios
      .get(`http://localhost:5555/user/${userId}/fivesales`)
      .then(response => {
        setSales(response.data.data);
      })
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  console.log(sales);

  return (
    <div>
      <h2>Latest Sales</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Company</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          { sales.map(sale => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={ sale._id }>
              <td>{ sale.copra_ship_date }</td>
              <td>{ sale.manufacturer_id.full_name }</td>
              <td>{ sale.status }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable
