import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewSaleForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    manufacturer_id: '',
    amount_of_copra_sold: '',
    status: 'pending',
    copra_ship_date: '',
    cheque_receive_date: '',
    total_sales_price: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5555/sale', formData)  // Ensure the URL matches your backend endpoint
      .then(response => {
        console.log('Sale created:', response.data);
        navigate('/sale');  // Redirect back to the sales list after creation
      })
      .catch(error => console.error('Error creating sale:', error));
  };

  return (
    <div>
      <h2>Add New Sale</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_id">User ID:</label>
          <input type="text" id="user_id" name="user_id" value={formData.user_id} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="manufacturer_id">Manufacturer ID:</label>
          <input type="text" id="manufacturer_id" name="manufacturer_id" value={formData.manufacturer_id} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="amount_of_copra_sold">Amount of Copra Sold:</label>
          <input type="number" id="amount_of_copra_sold" name="amount_of_copra_sold" value={formData.amount_of_copra_sold} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} required>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="copra_ship_date">Copra Ship Date:</label>
          <input type="date" id="copra_ship_date" name="copra_ship_date" value={formData.copra_ship_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="cheque_receive_date">Cheque Receive Date:</label>
          <input type="date" id="cheque_receive_date" name="cheque_receive_date" value={formData.cheque_receive_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="total_sales_price">Total Sales Price:</label>
          <input type="number" id="total_sales_price" name="total_sales_price" value={formData.total_sales_price} onChange={handleChange} required />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate('/sale')}>Cancel</button>
      </form>
    </div>
  );
};

export default NewSaleForm;
