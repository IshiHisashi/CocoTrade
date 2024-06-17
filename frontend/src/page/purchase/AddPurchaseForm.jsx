import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPurchaseForm = ({ setShowAddForm, purchase, handleUpdate }) => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    farmer_id: '',
    invoice_number: '',
    purchase_date: '',
    sales_unit_price: '', 
    amount_of_copra_purchased: '',
    moisture_test_details: '',
    total_purchase_price: '',
    user_id: '66640d8158d2c8dc4cedaf1e'
  });

  const userid = '66640d8158d2c8dc4cedaf1e';

  useEffect(() => {
    // Fetch user data
    axios.get(`http://localhost:5555/user/${userid}`)
      .then(response => {
        setUser(response.data.data); 
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });

    // Fetch farmers
    axios.get('http://localhost:5555/farmer')
      .then(response => {
        setFarmers(response.data);
      })
      .catch(error => {
        console.error('Error fetching farmers:', error);
      });

    // Fetch price suggestion
    axios.get(`http://localhost:5555/user/${userid}/pricesuggestion/getone`)
      .then(response => {
        if (response.data.status === 'success') {
          setFormData((prevData) => ({
            ...prevData,
            sales_unit_price: parseFloat(response.data.data?.$numberDecimal ?? response.data.data), 
          }));
        }
      })
      .catch(error => {
        console.error('Error fetching price suggestion:', error);
      });

    // Generate invoice number
    if (!purchase) {
      const generateInvoiceNumber = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'IN';
        for (let i = 0; i < 8; i += 1) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      };

      setFormData((prevData) => ({
        ...prevData,
        invoice_number: generateInvoiceNumber(),
      }));
    }
  }, [purchase]); // Include purchase in the dependency array

  useEffect(() => {
    if (purchase) {
      setFormData({
        ...purchase,
                          // eslint-disable-next-line no-underscore-dangle 
        farmer_id: purchase.farmer_id?._id ?? '',
        sales_unit_price: parseFloat(purchase.sales_unit_price?.$numberDecimal ?? purchase.sales_unit_price),
        amount_of_copra_purchased: parseFloat(purchase.amount_of_copra_purchased?.$numberDecimal ?? purchase.amount_of_copra_purchased),
        moisture_test_details: parseFloat(purchase.moisture_test_details?.$numberDecimal ?? purchase.moisture_test_details),
        total_purchase_price: parseFloat(purchase.total_purchase_price?.$numberDecimal ?? purchase.total_purchase_price),
        purchase_date: purchase.purchase_date ? new Date(purchase.purchase_date).toISOString().split('T')[0] : '',
        user_id: userid,
      });
    }
  }, [purchase]); // Include purchase in the dependency array

  useEffect(() => {
    const calculateTotalPurchasePrice = () => {
      const unitPrice = parseFloat(formData.sales_unit_price);
      const amountPurchased = parseFloat(formData.amount_of_copra_purchased);
      const moistureLevel = parseFloat(formData.moisture_test_details);
      let total = unitPrice * amountPurchased;

      if (moistureLevel > 7) {
        total *= 0.85; 
      }

      if (!Number.isNaN(total)) {
        setFormData((prevData) => ({
          ...prevData,
          total_purchase_price: total.toFixed(2),
        }));
      }
    };

    calculateTotalPurchasePrice();
  }, [formData.sales_unit_price, formData.amount_of_copra_purchased, formData.moisture_test_details]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (purchase) {
        await handleUpdate(formData);
      } else {
        const response = await axios.post('http://localhost:5555/purchase', formData);
        console.log('Purchase created:', response.data);
                          // eslint-disable-next-line no-underscore-dangle 
        const purchaseId = response.data._id;

        const updatedPurchasesArray = [...user.purchases_array, purchaseId];

        await axios.patch(`http://localhost:5555/user/${userid}`, {
          purchases_array: updatedPurchasesArray
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error creating/updating purchase:', error);
    }
  };

  return (
    <div>
      <h2>{purchase ? 'Edit Purchase' : 'New Purchase'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="invoice_number">
            Invoice No:
            <span>{formData.invoice_number}</span>
          </label>
        </div>
        <div>
          <label htmlFor="purchase_date">
            Date Purchased:
            <input type="date" id="purchase_date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label htmlFor="farmer_id">
            Farmer Name:
            <select id="farmer_id" name="farmer_id" value={formData.farmer_id} onChange={handleChange} required>
              <option value="">First name / Last name</option>
              {farmers.map(farmer => (
                                  // eslint-disable-next-line no-underscore-dangle 
                <option key={farmer._id} value={farmer._id}>
                  {farmer.full_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="sales_unit_price">
            Price per kilo:
            <span>PHP</span>
            <input type="text" id="sales_unit_price" name="sales_unit_price" placeholder="32.00 per kg" value={formData.sales_unit_price} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label htmlFor="amount_of_copra_purchased">
            Copra bought:
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                id="amount_of_copra_purchased"
                name="amount_of_copra_purchased"
                value={formData.amount_of_copra_purchased}
                onChange={handleChange}
                required
                style={{ marginRight: '5px' }}
              />
              <span>kg</span>
            </div>
          </label>
        </div>
        <div>
          <label htmlFor="moisture_test_details">
            Moisture Test Details:
            <input type="text" id="moisture_test_details" name="moisture_test_details" value={formData.moisture_test_details} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label htmlFor="total_purchase_price">
            Total Sale:
            <input type="text" id="total_purchase_price" name="total_purchase_price" value={`PHP ${formData.total_purchase_price}`} readOnly />
          </label>
        </div>
        <div>
          <button type="button" onClick={() => {setShowAddForm(false); window.location.reload();}}>Clear</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchaseForm;
