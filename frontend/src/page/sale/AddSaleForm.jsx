import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewSaleForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    manufacturer_id: '',
    amount_of_copra_sold: '', 
    sales_unit_price: '', 
    status: 'pending',
    copra_ship_date: '',
    cheque_receive_date: '',
    total_sales_price: '',
  });

  useEffect(() => {
    const calculateTotalSalesPrice = () => {
      const unitPrice = parseFloat(formData.sales_unit_price);
      const amountSold = parseFloat(formData.amount_of_copra_sold);
      if (!Number.isNaN(unitPrice) && !Number.isNaN(amountSold)) {
        const total = unitPrice * amountSold;
        setFormData((prevData) => ({
          ...prevData,
          total_sales_price: total,
        }));
      }
    };

    calculateTotalSalesPrice();
  }, [formData.sales_unit_price, formData.amount_of_copra_sold]);

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
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} required>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      <div>
          <label htmlFor="copra_ship_date">Shipment Date:</label>
          <input type="date" id="copra_ship_date" name="copra_ship_date" value={formData.copra_ship_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="manufacturer_id">Manufacturer: </label>
          <input type="text" id="manufacturer_id" name="manufacturer_id" placeholder="Company Name" value={formData.manufacturer_id} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="sales_unit_price">Sales Unit Price: PHP </label>
          <input type="text" id="sales_unit_price" name="sales_unit_price" placeholder="32.00 per kg" value={formData.sales_unit_price} onChange={handleChange} required />
        </div> 
        <div>
          <label htmlFor="amount_of_copra_sold">Copra Sold:</label>
          <input type="number" id="amount_of_copra_sold" name="amount_of_copra_sold" value={formData.amount_of_copra_sold} onChange={handleChange} required />
          <span>kg</span>
        </div>       
        <div>
          <label htmlFor="cheque_receive_date">Received On:</label>
          <input type="date" id="cheque_receive_date" name="cheque_receive_date" value={formData.cheque_receive_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="total_sales_price">Total Sales Price: PHP </label>
          <input type="number" id="total_sales_price" name="total_sales_price" value={formData.total_sales_price} onChange={handleChange} required />
        </div>
        <button type="button" onClick={() => navigate('/sale')}>Clear</button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default NewSaleForm;
