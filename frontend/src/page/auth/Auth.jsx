import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import ForgetPassword from "./ForgetPassword";

const Auth = ({ URL }) => {
  return (
    <div>
      <h1>Welcome to CocoTrade!</h1>
      <Routes>
        <Route path="signup" element={<SignupForm URL={URL} />} />
        <Route path="login" element={<LoginForm URL={URL} />} />
        <Route path="forgetpassword" element={<ForgetPassword URL={URL} />} />
      </Routes>
    </div>
  );
};

export default Auth;
