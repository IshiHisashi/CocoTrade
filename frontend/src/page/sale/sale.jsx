import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ViewSalesTable from './ViewSalesTable';
import EditSaleModal from './EditSaleModal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const Sale = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const saleId = "66622c07858df5960bf57a06";
    const url = `http://localhost:5555/tmpFinRoute/${saleId}/sale`;
    axios.get(url)
      .then(response => {
        setSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching sales:', error);
      });
  }, []);

  const handleEdit = (sale) => {
    setSelectedSale(sale);
  };

  const handleUpdate = async (updatedSale) => {
    try {
                                        // eslint-disable-next-line no-underscore-dangle 
      await axios.patch(`http://localhost:5555/sale/${updatedSale._id}`, updatedSale);
      setShowAddForm(false);
      setSelectedSale(null);
      setSales((prevSales) => prevSales.map((sale) => 
                                          // eslint-disable-next-line no-underscore-dangle 
        sale._id === updatedSale._id ? updatedSale : sale
      ));
      window.location.reload();

    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };


  return (
    <div>
      <div>Sales Log</div>
      <Modal
        isOpen={showAddForm}
        onRequestClose={() => {setShowAddForm(false); window.location.reload();}}
        contentLabel="Edit Sales Form"
      >
      <EditSaleModal setShowAddForm={setShowAddForm} sale={selectedSale} handleUpdate={handleUpdate} />
      </Modal>
      <ViewSalesTable setShowAddForm={setShowAddForm} handleEdit={handleEdit} />
    </div>
  );
};

export default Sale;
