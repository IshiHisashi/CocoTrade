import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import login from '../../services/login'; 

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async () => {
        try {
          await login(email, password);
          setSuccessMessage('SignIn successful!'); 
          setEmail('');
          setPassword(''); 
        } catch (err) {
          setError(err.message);
          console.error("Login error:", err);
        }
    };


    return (
      <div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        <button type="button" onClick={handleLogin}>Sign In</button>
        <p><Link to="/auth/forgetpassword"> Forgot password? </Link>.</p>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <p>Don’t have an account? <Link to="/auth/signup">Sign up</Link>.</p>
      </div>
    );
};

export default LoginForm;
