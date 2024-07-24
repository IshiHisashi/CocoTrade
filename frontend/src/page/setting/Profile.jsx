import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CtaBtn from '../../component/btn/CtaBtn';
import Field from '../../component/field-filter/Field';

const Profile = ({ userId, URL, userInfo, setUserInfo, winWidth }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    full_name: "",
    country: "",
  });
  const [prevFormData, setPrevFormData] = useState(null);

  useEffect(() => {
    if(userInfo) {
      setFormData({
        company_name: userInfo.company_name,
        email: userInfo.email,
        full_name: userInfo.full_name,
        country: userInfo.country,
      })
      setPrevFormData({
        company_name: userInfo.company_name,
        email: userInfo.email,
        full_name: userInfo.full_name,
        country: userInfo.country,
      })
    }
  }, [userInfo]);

  const updateUserInfo = async () => {
    try {
      const updatedUserInfo = await axios.patch(`${URL}/user/${userId}`, formData);
      console.log(updatedUserInfo);
    }
    catch (err) {
      console.error("Failed to update user info: ", err);
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
      updateUserInfo();
    }
    catch (err) {
      console.error("Failed to submit the form:", err);
    }
  }

  return (
    <div className='px-[35px] py-[24px] bg-neutral-0 sm:rounded-lg sm:max-w-[436px]'>
      <form onSubmit={handleSubmit}>
        <h3 className='h3-sans mb-[15px]'>Personal information</h3>
        <Field
          label="Company Name"
          name="company_name"
          type="text"
          value={formData.company_name}
          onChange={handleChange}
        />
        <Field
          label="Email"
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
        />
        <Field
          label="Full Name"
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
        />
        <div id="partition" className='h-0 border border-neutral-200 my-[33px]'> </div>
        <h3 className='h3-sans mb-[15px]'>Address</h3>
        <Field
          label="Country"
          name="country"
          type="text"
          value={formData.country}
          onChange={handleChange}
          disabled
        />
        <CtaBtn 
          size={ winWidth >= 640 ? "S" : "L" } 
          level={ 
            prevFormData !== null && 
            prevFormData.company_name === formData.company_name && 
            prevFormData.email === formData.email && 
            prevFormData.full_name === formData.full_name && 
            prevFormData.country === formData.country ? 
            "D" : "S" 
          }
          type="submit"
          innerTxt="Save" 
          disabled = { 
            prevFormData !== null && 
            prevFormData.company_name === formData.company_name && 
            prevFormData.email === formData.email && 
            prevFormData.full_name === formData.full_name && 
            prevFormData.country === formData.country
          }
        />
      </form>
    </div>
  )
}

export default Profile
