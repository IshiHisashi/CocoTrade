// src/page/sale/sale.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sale = () => {
  const sales = [
    // Example sales data
    { id: '1', name: 'Sale 1' },
    { id: '2', name: 'Sale 2' },
  ];

  return (
    <div>
      <h2>Sales</h2>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            {sale.name} <Link to={`/sale/edit/${sale.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sale;
