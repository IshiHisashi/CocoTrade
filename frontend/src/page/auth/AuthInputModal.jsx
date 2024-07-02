import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CtaBtn from "../../component/btn/CtaBtn.jsx";
import Field from "../../component/field-filter/Field.jsx";
import signUp from "../../services/authService.jsx";
import login from "../../services/login.jsx";
import resetPassword from "../../services/resetPassword.jsx";
import Exit from "../../assets/icons/Exit.svg";

const AuthInputModal = (props) => {
  const {
    authType,
    fnToChangeAuthType,
    fnToSetNextModalType,
    fnToOpenNextModal,
    fnToCloseThisModal,
  } = props;

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (
      email === "" ||
      password === "" ||
      fullName === "" ||
      companyName === ""
    ) {
      window.alert("Please fill out all the input fields.");
    } else {
      try {
        const newUserDoc = await signUp(email, password, fullName, companyName);
        if (newUserDoc.status === "success") {
          fnToSetNextModalType("accountCreated");
          fnToOpenNextModal(true);
          fnToCloseThisModal(false);
        }
      } catch (error) {
        window.alert(`Firebase Auth error: ${error.message}`);
      }
    }
  };

  const handleLogin = async () => {
    if (email === "" || password === "") {
      window.alert("Please fill out all the input fields.");
    } else {
      try {
        const user = await login(email, password);
        try {
          const res = await axios.get(`http://localhost:5555/user/${user.uid}`);
          const userDoc = res.data.data;
          console.log(userDoc);
          if (
            userDoc.country &&
            userDoc.currency &&
            userDoc.margin &&
            userDoc.max_inventory_amount &&
            userDoc.amount_per_ship
          ) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding/business");
          }
        } catch (error) {
          console.log(`Error getting user doc from DB: ${error.message}`);
        }
      } catch (error) {
        window.alert(`Firebase Auth error: ${error.message}`);
      }
    }
  };

  const handleResetPassword = async () => {
    if (email === "") {
      window.alert("Please fill out all the input fields.");
    } else {
      try {
        await resetPassword(email);
        fnToSetNextModalType("PasswordRequest");
        fnToOpenNextModal(true);
        fnToCloseThisModal(false);
      } catch (error) {
        window.alert(`Firebase Auth error: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center m-7 gap-5">
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => fnToCloseThisModal(false)}
      >
        <img src={Exit} alt="close" />
      </button>

      {/* eslint-disable-next-line no-nested-ternary */}
      {authType === "signup" ? (
        <>
          <h1>Create an account</h1>
          <form>
            <Field
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              required
            />
            <Field
              label="Company Name"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              type="text"
              required
            />
            <Field
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <Field
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
            <CtaBtn
              size="L"
              level="P"
              innerTxt="Sign up"
              onClickFnc={async () => {
                await handleSignup();
              }}
            />
          </form>
        </>
      ) : // eslint-disable-next-line no-nested-ternary
      authType === "login" ? (
        <>
          <h1>Welcome back</h1>
          <form>
            <Field
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <Field
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
            <button
              type="button"
              className="block underline mb-8"
              onClick={() => fnToChangeAuthType("passwordReset")}
            >
              Forgot password?
            </button>
            <CtaBtn
              size="L"
              level="P"
              innerTxt="Log in"
              onClickFnc={async () => {
                await handleLogin();
              }}
            />
            <p className="text-center mt-8">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => fnToChangeAuthType("signup")}
              >
                Sign up
              </button>
            </p>
          </form>
        </>
      ) : authType === "passwordReset" ? (
        <>
          <h1>Forgot your password?</h1>
          <Field
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <CtaBtn
            size="L"
            level="P"
            innerTxt="Request to reset password"
            onClickFnc={async () => {
              await handleResetPassword();
            }}
          />
        </>
      ) : (
        <>
          <h1>Something went wrong...</h1>
          <p>Please try again.</p>
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Close"
            onClickFnc={() => fnToCloseThisModal(false)}
          />
        </>
      )}
    </div>
  );
};

export default AuthInputModal;
