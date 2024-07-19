import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CtaBtn from "../../component/btn/CtaBtn.jsx";
import Field from "../../component/field-filter/Field.jsx";
import signUp from "../../services/authService.jsx";
import login from "../../services/login.jsx";
import resetPassword from "../../services/resetPassword.jsx";
import Exit from "../../assets/icons/Exit.svg";
import CocoTradeLogo from "../../assets/CocoTradeLogoForLightBg.svg";
import CocoTradeIcon from "../../assets/icons/CocoTradeIcon-Orange.svg";

const AuthInputModal = (props) => {
  const {
    authType,
    fnToChangeAuthType,
    fnToSetNextModalType,
    fnToOpenNextModal,
    fnToCloseThisModal,
    URL,
  } = props;
  // console.log(URL);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (email && password && fullName && companyName) {
      try {
        const newUserDoc = await signUp(
          email,
          password,
          fullName,
          companyName,
          URL
        );
        if (newUserDoc.status === "success") {
          fnToSetNextModalType("accountCreated");
          fnToOpenNextModal(true);
          fnToCloseThisModal(false);
        }
      } catch (error) {
        window.alert(`Firebase Auth error: ${error.message}`);
      }
    } else {
      window.alert("Please fill out all the input fields.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const user = await login(email, password);
        try {
          const res = await axios.get(`${URL}/user/${user.uid}`);
          const userDoc = res.data.data;
          console.log(URL);
          if (
            userDoc.country &&
            userDoc.margin &&
            userDoc.max_inventory_amount &&
            userDoc.amount_per_ship
          ) {
            navigate("/dashboard");
          } else {
            fnToCloseThisModal(false);
            navigate("/onboarding/business");
          }
        } catch (error) {
          console.log(`Error getting user doc from DB: ${error.message}`);
        }
      } catch (error) {
        window.alert(`Firebase Auth error: ${error.message}`);
      }
    } else {
      window.alert("Please fill out all the input fields.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (email) {
      try {
        await resetPassword(email);
        fnToSetNextModalType("PasswordRequest");
        fnToOpenNextModal(true);
        fnToCloseThisModal(false);
      } catch (error) {
        window.alert(`Firebase Auth error: ${error.message}`);
      }
    } else {
      window.alert("Please fill out all the input fields.");
    }
  };

  let elementToReturn;

  switch (authType) {
    case "signup":
      elementToReturn = (
        <>
          <img src={CocoTradeLogo} alt="" aria-hidden />
          <h1 className="h2-serif-normal text-center">Create an account</h1>
          <form
            className="mt-6 max-w-96 w-full"
            onSubmit={async (e) => {
              await handleSignup(e);
            }}
          >
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
              type="submit"
              size="L"
              level={fullName && companyName && email && password ? "P" : "D"}
              innerTxt="Sign up"
              disabled={!(fullName && companyName && email && password)}
              // onClickFnc={}
            />
            <p className="text-center mt-8 link16 text-neutral-600">
              Already have an account?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => fnToChangeAuthType("login")}
              >
                Log in
              </button>
            </p>
          </form>
        </>
      );
      break;
    case "login":
      elementToReturn = (
        <>
          <img src={CocoTradeIcon} alt="" aria-hidden />
          <h1 className="h2-serif-normal text-center">Welcome back</h1>
          <form
            className="mt-6 max-w-96 w-full"
            onSubmit={async (e) => {
              await handleLogin(e);
            }}
          >
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
              className="block underline mb-8 link16 text-neutral-600"
              onClick={() => fnToChangeAuthType("passwordReset")}
            >
              Forgot password?
            </button>
            <CtaBtn
              type="submit"
              size="L"
              level={email && password ? "P" : "D"}
              innerTxt="Log in"
              disabled={!(email && password)}
              // onClickFnc={}
            />
            <p className="text-center mt-8 link16 text-neutral-600">
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
      );
      break;
    case "passwordReset":
      elementToReturn = (
        <>
          <img src={CocoTradeIcon} alt="" aria-hidden />
          <h1 className="h2-serif-normal text-center">Forgot your password?</h1>
          <form
            className="mt-6 max-w-96 w-full"
            onSubmit={async (e) => {
              await handleResetPassword(e);
            }}
          >
            <Field
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <CtaBtn
              type="submit"
              size="L"
              level={email ? "P" : "D"}
              innerTxt="Request to reset password"
              disabled={!email}
              // onClickFnc={}
            />
          </form>
        </>
      );
      break;
    default:
      elementToReturn = (
        <>
          <h1 className="h2-serif-normal text-center">
            Something went wrong...
          </h1>
          <p className="p18 text-center">Please try again.</p>
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Close"
            onClickFnc={() => fnToCloseThisModal(false)}
          />
        </>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-8 mx-4 sm:m-7 gap-5">
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => fnToCloseThisModal(false)}
      >
        <img src={Exit} alt="close" />
      </button>

      {elementToReturn}
    </div>
  );
};

export default AuthInputModal;
