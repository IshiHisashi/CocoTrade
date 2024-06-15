import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPurchaseTable = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // Fetch purchase data from the backend
    axios.get('http://localhost:5555/purchase')
      .then(response => {
        setPurchases(response.data);
      })
      .catch(error => {
        console.error('Error fetching purchases:', error);
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
      <h2>Purchase Log</h2>
      <table>
        <thead>
          <tr>
            <th>Invoice No.</th>
            <th>Farmer Name</th>
            <th>Copra Bought</th>
            <th>Moisture</th>
            <th>Price/Kilo</th>
            <th>Total Purchase</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(purchase => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={purchase._id}>
              <td>{purchase.invoice_number}</td>
              <td>{purchase.farmer_id ? purchase.farmer_id.full_name : 'N/A'}</td>
              <td>{`${formatDecimal(purchase.amount_of_copra_purchased)} kg`}</td>
              <td>{`${formatDecimal(purchase.moisture_test_details)}%`}</td>
              <td>{`PHP ${formatDecimal(purchase.sales_unit_price)}`}</td>
              <td>{`PHP ${formatDecimal(purchase.total_purchase_price)}`}</td>
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

export default ViewPurchaseTable;
