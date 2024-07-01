import React, { useState } from "react";
import CtaBtn from "../../component/btn/CtaBtn.jsx";
import Field from "../../component/field-filter/Field.jsx";

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

  return (
    <div className="flex flex-col items-center justify-center m-7 gap-5">
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
              type="submit"
              size="L"
              level="P"
              innerTxt="Sign up"
              onClickFnc={() => {
                fnToSetNextModalType("accountCreated");
                fnToOpenNextModal(true);
                fnToCloseThisModal(false);
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
