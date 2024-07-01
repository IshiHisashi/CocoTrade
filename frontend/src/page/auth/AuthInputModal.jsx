import React, { useState } from "react";
import CtaBtn from "../../component/btn/CtaBtn.jsx";
import Field from "../../component/field-filter/Field.jsx";
import signUp from "../../services/authService.jsx";

const AuthInputModal = (props) => {
  const {
    authType,
    fnToSetNextModalType,
    fnToOpenNextModal,
    fnToCloseThisModal,
  } = props;

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hadleSignup = async () => {
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

  return (
    <div className="flex flex-col items-center justify-center m-7 gap-5">
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => fnToCloseThisModal(false)}
      >
        x
      </button>

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
                await hadleSignup();
              }}
            />
          </form>
        </>
      ) : (
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
            <p>Forgot password?</p>
            <CtaBtn type="submit" size="L" level="P" innerTxt="Log in" />
            {/* onClickFnc={} */}
            <p>Don&apos;t have an account? Sign up</p>
          </form>
        </>
      )}
    </div>
  );
};

export default AuthInputModal;
