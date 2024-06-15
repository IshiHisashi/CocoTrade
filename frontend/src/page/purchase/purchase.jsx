import React from "react";
import { Link } from 'react-router-dom';

const Purchase = () => {
  const purchases = [
    // Example purchase data
    { id: '1', name: 'purchase 1' },
    { id: '2', name: 'purchase 2' },
  ];

  return (
    <div>
      <h2>Purchase Log</h2>
      <ul>
        {purchases.map((purchase) => (
          <li key={purchase.id}>
            {purchase.name} <Link to={`/purchase/edit/${purchase.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Purchase;
