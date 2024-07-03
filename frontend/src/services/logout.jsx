import axios from "axios";
import { signOut } from "firebase/auth";
import auth from "../../firebase-config";

const logout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;  
    }
  };
  
  export default logout;
