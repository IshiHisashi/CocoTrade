import React, { useState, useEffect } from 'react'
import axios from 'axios';

const PlanShipment = ({ userId, setShowModal }) => {

  const [manufacturers, setManufacturers] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    manufacturer_id: '',
    amount_of_copra_sold: '',
    sales_unit_price: '',
    status: '', 
    copra_ship_date: '',
    cheque_receive_date: '',
    total_sales_price: '',
    user_id: userId
  });

  useEffect(() => {
    // Fetch user data
    axios.get(`http://localhost:5555/user/${userId}`)
      .then(response => {
        console.log(response.data.data);
        setUser(response.data.data); 
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });

    // Fetch manufacturers
    axios.get(`http://localhost:5555/user/${userId}/manu`)
    .then(response => {
      console.log(response.data.data.manufacturers);
      setManufacturers(response.data.data.manufacturers);
    })
    .catch(error => {
      console.error('Error fetching manufacturers:', error);
    });
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [userId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/sale', formData);
      console.log('Shipment/sale created:', response.data);
      // eslint-disable-next-line no-underscore-dangle 
      const saleId = response.data._id;
      const updatedSalesArray = [...user.sales_array, saleId];
      await axios.patch(`http://localhost:5555/user/${userId}`, {sales_array: updatedSalesArray});
      setShowModal(false)
    }
    catch (error) {
      console.error('Error creating/updating sale:', error);
    }
  }

  return (
    <div>
      <h2>Plan Your Shipment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="manufacturer_id">
            Company / Manufacturer Name:
            <select id="manufacturer_id" name="manufacturer_id" value={formData.manufacturer_id} onChange={handleChange} required>
              <option value="">First name / Last name</option>
              {manufacturers.map(manu => (
                                  // eslint-disable-next-line no-underscore-dangle 
                <option key={manu._id} value={manu._id}>
                  {manu.full_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="copra_ship_date">
            Date Purchased:
            <input type="date" id="copra_ship_date" name="copra_ship_date" value={formData.copra_ship_date} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label htmlFor="amount_of_copra_sold">
            Copra sold / weight in kg:
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                id="amount_of_copra_sold"
                name="amount_of_copra_sold"
                value={formData.amount_of_copra_sold}
                onChange={handleChange}
                required
                style={{ marginRight: '5px' }}
              />
              <span>kg</span>
            </div>
          </label>
        </div>
        <div>
          <button type="button" onClick={() => {setShowModal(false);}}>Clear</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}

export default PlanShipment
