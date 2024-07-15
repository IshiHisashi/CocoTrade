import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SalesTable = ({ userId, URL, showConfirmation }) => {
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  useEffect(
    () => {
      axios.get(`${URL}/user/${userId}/fivesales`).then((response) => {
        setSales(response.data.data);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showConfirmation]
  );

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
          {sales.map((sale) => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={sale._id}>
              <td>{sale.copra_ship_date.split("T")[0]}</td>
              <td>{sale.manufacturer_id.full_name}</td>
              <td>{sale.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        onClick={() => navigate("/sales")} 
        type="button"
      >
        View sales log
      </button>
    </div>
  );
};

export default SalesTable;
