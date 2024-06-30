import React, { useState } from 'react';
import signUp from '../../services/authService'; 

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
  
    const handleSignup = async () => {
      try {
        const user = await signUp(email, password, fullName, companyName);
        setSuccessMessage('Signup successful!');  
      } catch (err) {
        setError(err.message);
        setSuccessMessage('');
      }
    };
  
    return (
      <div>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter your company name" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        <button type="button" onClick={handleSignup}>Sign Up</button>
      </div>
    );
};

export default SignupForm;
