import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewSalesTable = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Fetch sales data from the backend
    axios.get('http://localhost:5555/sale')
      .then(response => {
        setSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching sales:', error);
      });
  }, []);

  const formatDecimal = (decimal128) => {
    if (!decimal128 || !decimal128.$numberDecimal) {
      return '0.00';
    }
    return parseFloat(decimal128.$numberDecimal).toFixed(2);
  };

  return (
    <div>
      <h2>Sales Log</h2>
      <table>
        <thead>
          <tr>
            <th>Ship Date</th>
            <th>Manufacturer</th>
            <th>Sales Unit Price</th>
            <th>Copra Sold</th>
            <th>Received On</th>
            <th>Total Sale</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={sale._id}>
              <td>{new Date(sale.copra_ship_date).toLocaleDateString()}</td>
              <td>{sale.manufacturer_id ? sale.manufacturer_id.full_name : 'N/A'}</td>
              <td>{formatDecimal(sale.sales_unit_price)}</td>
              <td>{`${formatDecimal(sale.amount_of_copra_sold)} kg`}</td>
              <td>{sale.cheque_receive_date ? new Date(sale.cheque_receive_date).toLocaleDateString() : 'N/A'}</td>
              <td>{`PHP ${formatDecimal(sale.total_sales_price)}`}</td>
              <td>{sale.status}</td>
              <td>
                <div className="dropdown">
                  <div className="dropdown-content">
                    <button type="button" onClick={() => alert('Edit Clicked')}>Edit</button>
                    <button type="button" onClick={() => alert('Delete Clicked')}>Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ViewSalesTable;
