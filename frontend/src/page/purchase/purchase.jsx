import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import AddPurchaseForm from './AddPurchaseForm.jsx';

// Set the app element for accessibility
Modal.setAppElement('#root');

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Fetch purchases data from the backend
    axios.get('http://localhost:5555/purchase')
      .then(response => {
        setPurchases(response.data);
      })
      .catch(error => {
        console.error('Error fetching purchases:', error);
      });
  }, []);

  const parseDecimal = (decimalObj) => {
    return decimalObj ? parseFloat(decimalObj.$numberDecimal) : 0;
  };

  return (
    <div>
      <h2>Purchase Log</h2>
      <button type="button" onClick={() => setShowAddForm(true)}>Add New Purchase</button>
      <Modal
        isOpen={showAddForm}
        onRequestClose={() => setShowAddForm(false)}
        contentLabel="Add Purchase Form"
      >
        <AddPurchaseForm setShowAddForm={setShowAddForm} />
      </Modal>
    </div>
  );
};

export default Purchase;
