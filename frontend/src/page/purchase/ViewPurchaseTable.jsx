import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPurchaseTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchPurchases = () => {
    axios.get('http://localhost:5555/purchase')
      .then(response => {
        setPurchases(response.data);
      })
      .catch(error => {
        console.error('Error fetching purchases:', error);
      });
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const formatDecimal = (decimal128) => {
    if (!decimal128 || !decimal128.$numberDecimal) {
      return '0.00';
    }
    return parseFloat(decimal128.$numberDecimal).toFixed(2);
  };

  const handleDeleteClick = async (purchaseId) => {
    try {
      await axios.delete(`http://localhost:5555/purchase/${purchaseId}`);
      fetchPurchases(); // Refresh the purchases list
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = purchases.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(purchases.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
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
          {currentRecords.map(purchase => (
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
                  <button type="button"
                    className="dropbtn" 
                    // eslint-disable-next-line no-underscore-dangle
                    onClick={() => setDropdownVisible(dropdownVisible === purchase._id ? null : purchase._id)}>...</button>{dropdownVisible === purchase._id && (
                    <div className="dropdown-content">
                      <button type="button" onClick={() => alert('Edit Clicked')}>Edit</button>
                      <button type="button" onClick={() => 
                        // eslint-disable-next-line no-underscore-dangle
                        handleDeleteClick(purchase._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button type="button" onClick={handlePrevPage} disabled={currentPage === 1}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button type="button"
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ViewPurchaseTable;
