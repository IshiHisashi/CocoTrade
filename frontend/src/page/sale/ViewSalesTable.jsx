import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditSaleModal from './EditSaleModal';

const ViewSalesTable = ({ setShowAddForm, handleEdit })  => {
  const [sales, setSales] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchSales = () => {
    axios.get('http://localhost:5555/sale')
      .then(response => {
        setSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching sales:', error);
      });
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const formatDecimal = (decimal128) => {
    if (!decimal128 || !decimal128.$numberDecimal) {
      return '0.00';
    }
    return parseFloat(decimal128.$numberDecimal).toFixed(2);
  };

  const handleDeleteClick = async (saleId) => {
    try {
      await axios.delete(`http://localhost:5555/sale/${saleId}`);
      fetchSales(); // Refresh the purchases list
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const handleEditClick = (sale) => {
    setShowAddForm(true);
    handleEdit(sale);
  };
  
  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sales.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sales.length / recordsPerPage);

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
          {currentRecords.map(sale => (
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
                  <button type="button"
                    className="dropbtn" 
                    // eslint-disable-next-line no-underscore-dangle
                    onClick={() => setDropdownVisible(dropdownVisible === sale._id ? null : sale._id)}>...</button>{dropdownVisible === sale._id && (
                    <div className="dropdown-content">
                      <button type="button" onClick={() => {handleEditClick(sale)}}>Edit</button>
                      <button type="button" onClick={() => 
                        // eslint-disable-next-line no-underscore-dangle
                        handleDeleteClick(sale._id)}>Delete</button>                    
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

export default ViewSalesTable;
