import React, { useState } from 'react';
import resetPassword from '../../services/resetPassword'; 


const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async () => {
        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }
        try {
            await resetPassword(email);
            setMessage('If this email is registered, you will receive a reset link shortly.');
        } catch (error) {
            setMessage('Failed to send reset email. Please try again later.');
            console.error("Reset Password Error:", error);
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button type="button" onClick={handleReset}>Send Instructions</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgetPassword;