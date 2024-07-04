import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebase-config";

const signUp = async (email, password, fullName, companyName, URL) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUserId = userCredential.user.uid; // Getting the Firebase User ID

    const userData = {
      firebaseUserId,
      fullName,
      companyName,
      email,
    };

    // Send user data including Firebase UID to backend
    const response = await axios.post(`${URL}/user`, userData);

    if (response.status !== 201) {
      throw new Error("Failed to create user in backend");
    }

    return response.data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

export default signUp;
