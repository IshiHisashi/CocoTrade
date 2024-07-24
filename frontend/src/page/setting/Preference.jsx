import React, { useState, useEffect } from 'react';
import axios from "axios";
import CtaBtn from '../../component/btn/CtaBtn';
import Field from '../../component/field-filter/Field';

const Preference = ({ userId, URL, userInfo, setUserInfo }) => {
  const [latestInv, setLatestInv] = useState(null);
  const [latestFin, setLatestFin] = useState(null);
  const [formData, setFormData] = useState({
    margin: "",
    amount_per_ship: "",
    max_inventory_amount: "",
    current_amount_with_pending: "",
    current_balance: "",
  });
  const [prevFormData, setPrevFormData] = useState(null);

  useEffect(() => {
    // Fetch inv data
    axios
      .get(`${URL}/user/${userId}/latestInv`)
      .then((response) => {
        setLatestInv(response.data.latestInv[0]);
        console.log("Latest inv data: ", response.data.latestInv[0]);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    // Fetch fin data
    axios
      .get(`${URL}/tmpFinRoute/${userId}/currentbalance/latest`)
      .then((response) => {
        setLatestFin(response.data.data.doc[0]);
        console.log("Latest fin data: ", response.data.data.doc[0]);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [userId, URL])

  useEffect(() => {
    if(userInfo && latestInv && latestFin) {
      setFormData({
        margin: userInfo.margin.$numberDecimal * 100,
        amount_per_ship: userInfo.amount_per_ship,
        max_inventory_amount: userInfo.max_inventory_amount,
        current_amount_with_pending: latestInv.current_amount_with_pending.$numberDecimal,
        current_balance: latestFin.current_balance.$numberDecimal,
      })
      setPrevFormData({
        margin: userInfo.margin.$numberDecimal * 100,
        amount_per_ship: userInfo.amount_per_ship,
        max_inventory_amount: userInfo.max_inventory_amount,
        current_amount_with_pending: latestInv.current_amount_with_pending.$numberDecimal,
        current_balance: latestFin.current_balance.$numberDecimal,
      })
    }
  }, [setFormData, userInfo, latestInv, latestFin])

  const updateUserInfo = async () => {
    try {
      const salesObj = {
        margin: formData.margin / 100,
        amount_per_ship: formData.amount_per_ship,
        max_inventory_amount: formData.max_inventory_amount,
      }
      const updatedUserInfo = await axios.patch(`${URL}/user/${userId}`, salesObj);
      console.log(updatedUserInfo);
    }
    catch (err) {
      console.error("Failed to update user info: ", err);
    }
  }

  const updateLatestInv = async () => {
    try {
      const difference = latestInv.current_amount_with_pending.$numberDecimal - formData.current_amount_with_pending;
      const newLeft = latestInv.current_amount_left.$numberDecimal - difference
      const invObj = {
        current_amount_with_pending: formData.current_amount_with_pending,
        current_amount_left: newLeft,
      }
      const updatedLatestInv = await axios.patch(`${URL}/inventory/${latestInv._id}`, invObj);
      console.log(updatedLatestInv);
    }
    catch (err) {
      console.error("Failed to update inv info: ", err);
    }
  }

  const updateLatestFin = async () => {
    try {
      const finObj = {
        current_balance: formData.current_balance
      }
      const updatedLatestFin = await axios.patch(`${URL}/currentbalance/${latestFin._id}`, finObj);
      console.log(updatedLatestFin);
    }
    catch (err) {
      console.error("Failed to update fin info: ", err);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // If there is a change about user doc, update user doc.
      if (
        Number(formData.margin) !== Number(prevFormData.margin) ||
        Number(formData.amount_per_ship) !== Number(prevFormData.amount_per_ship) ||
        Number(formData.max_inventory_amount) !== Number(prevFormData.max_inventory_amount)
      ) {
        updateUserInfo();
      }

      // If there is a change about inv doc, update inv doc.
      if (
        Number(formData.current_amount_with_pending) !== Number(prevFormData.current_amount_with_pending)
      ) {
        updateLatestInv();
      }     

      // If there is a change about fin doc, update fin doc.
      if (
        Number(formData.current_balance) !== Number(prevFormData.current_balance)
      ) {
        updateLatestFin();
      }   
      
      setPrevFormData(formData);
    }
    catch (err) {
      console.error("Failed to submit the form:", err);
    }
  }

  return (
    <div className='px-[35px] py-[24px] bg-neutral-0 sm:rounded-lg sm:max-w-[436px]'>
      <form onSubmit={handleSubmit}>
        <h3 className='h3-sans mb-[15px]'>Preference</h3>
        <Field
          label="Profit margin"
          name="margin"
          type="number"
          value={formData.margin}
          onChange={handleChange}
        />
        <Field
          label="Shipment threshold percentage"
          name="amount_per_ship"
          type="number"
          value={formData.amount_per_ship}
          onChange={handleChange}
        />
        <Field
          label="Maximum warehouse capacity"
          name="max_inventory_amount"
          type="number"
          value={formData.max_inventory_amount}
          onChange={handleChange}
        />
        <Field
          label="Current inventory"
          name="current_amount_with_pending"
          type="number"
          value={formData.current_amount_with_pending}
          onChange={handleChange}
        />
        <Field
          label="Current balance"
          name="current_balance"
          type="number"
          value={formData.current_balance}
          onChange={handleChange}
        />
        <CtaBtn 
          size="L" 
          level={ 
            prevFormData !== null && 
            prevFormData.margin === formData.margin && 
            prevFormData.amount_per_ship === formData.amount_per_ship && 
            prevFormData.max_inventory_amount === formData.max_inventory_amount && 
            prevFormData.current_amount_with_pending === formData.current_amount_with_pending &&
            prevFormData.current_balance === formData.current_balance ? 
            "D" : "S" 
          }
          type="submit"
          innerTxt="Save" 
          disabled = {
            prevFormData !== null && 
            prevFormData.margin === formData.margin && 
            prevFormData.amount_per_ship === formData.amount_per_ship && 
            prevFormData.max_inventory_amount === formData.max_inventory_amount && 
            prevFormData.current_amount_with_pending === formData.current_amount_with_pending &&
            prevFormData.current_balance === formData.current_balance
          }
        />
      </form>
    </div>
  )
}

export default Preference