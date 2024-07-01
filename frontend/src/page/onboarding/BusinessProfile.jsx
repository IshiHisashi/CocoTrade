import React, { useState } from "react";
import Field from "../../component/field-filter/Field";
import CtaBtn from "../../component/btn/CtaBtn";

const BusinessProfile = () => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  const storeInputInSession1 = () => {
    sessionStorage.setItem("fullName", fullName);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("companyName", companyName);
    sessionStorage.setItem("country", country);
  };

  return (
    <>
      <div>
        <h1>Business Profile</h1>
      </div>

      <h2 className="text-4xl">Let&apos;s set up your profile</h2>
      <p>Provide basic business information to start</p>

      <div className="grid grid-cols-2 gap-6 pt-8">
        <Field
          label="Full name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          required
          disabled
          showChangeButton
        />
        <Field
          label="Email address"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          disabled
          showChangeButton
        />
        <Field
          label="Company name"
          name="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          type="text"
          required
        />
        <Field
          label="Country"
          name="companyName"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          type="text"
          required
        />
      </div>

      <CtaBtn
        size="M"
        level="P"
        innerTxt="Next"
        onClickFnc={() => {
          storeInputInSession1();
        }}
      />
    </>
  );
};

export default BusinessProfile;
