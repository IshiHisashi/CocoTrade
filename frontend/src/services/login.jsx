import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebase-config";

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in", userCredential.user);

    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export default login;
