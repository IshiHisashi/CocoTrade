import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewSalesTable from './ViewSalesTable';

const Sale = () => {
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

  return (
    <div>
      <div>Sales Log</div>
      <ViewSalesTable sales={sales} />
    </div>
  );
};

export default Sale;
