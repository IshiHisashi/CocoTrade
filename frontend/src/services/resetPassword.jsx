import axios from 'axios';
import { sendPasswordResetEmail } from "firebase/auth";
import auth from '../../firebase-config';  

const resetPassword = async (email) => {
    try {
      // Send the password reset email
      await sendPasswordResetEmail(auth, email);
  
      // Optionally log this request to your backend if needed
      // await axios.post("http://localhost:5555/log-reset-password", { email });
  
      return 'Reset password email sent successfully. Please check your email.';
    } catch (error) {
      console.error("Reset Password Error:", error);
      throw new Error('Failed to send reset password email.');
    }
  };
  
  export default resetPassword;