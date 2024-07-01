import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import ForgetPassword from "./ForgetPassword";

const Auth = () => {
  return (
    <div>
      <h1>Welcome to CocoTrade!</h1>
      <Routes>
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="forgetpassword" element={<ForgetPassword />} />
      </Routes>
    </div>
  );
};

export default Auth;