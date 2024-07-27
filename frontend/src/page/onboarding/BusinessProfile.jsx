import React from "react";
import { useNavigate } from "react-router-dom";
import Field from "../../component/field-filter/Field";
import CtaBtn from "../../component/btn/CtaBtn";
import image1 from "./assets/image1.png";
import progress1 from "./assets/progress1.svg";

const BusinessProfile = (props) => {
  const {
    fullName,
    setFullName,
    companyName,
    setCompanyName,
    email,
    setEmail,
    country,
    setCountry,
  } = props;

  const navigate = useNavigate();

  const onClickNext = () => {
    if (fullName && email && companyName && country) {
      sessionStorage.setItem("fullName", fullName);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("companyName", companyName);
      sessionStorage.setItem("country", country);
      navigate("/onboarding/operations");
    } else {
      window.alert("Please fill out all the input fields.");
    }
  };

  return (
    <section className="relative min-h-screen w-screen grid content-end md:grid-cols-3">
      <div
        className="bg-[90%_-25rem] md:bg-center bg-fixed md:bg-local md:bg-cover absolute md:static top-0 min-h-screen w-screen md:w-auto blur-sm md:filter-none -z-10 md:order-2"
        style={{ backgroundImage: `url(${image1})` }}
      />

      <div className="w-full bg-white p-8 mt-32 md:mt-8 filter-none md:order-1 md:col-span-2 max-w-[900px] mx-auto grid">
        <div>
          <img src={progress1} alt="" aria-hidden className="mb-8" />
          <h1 className="h4-sans-uppercase text-neutral-600">
            BUSINESS PROFILE
          </h1>
        </div>

        <h2 className="font-['Rasa'] text-[30px] font-[600] sm:text-[40px] text-neutral-600 pt-8">
          Let&apos;s set up your profile
        </h2>
        <p className="p18 text-neutral-600">
          Provide basic business information to start
        </p>

        <div className="grid sm:grid-cols-2 gap-x-6 pt-8">
          <Field
            label="Full name"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            required
            disabled
            // showChangeButton
          />
          <Field
            label="Email address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            disabled
            // showChangeButton
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
            disabled
            info
            infoText="The location will indicate the currency &#8212;currently, our app is available only in the Philippines."
          />
        </div>

        <div className="grid justify-self-end mt-4 sm:mt-16 md:mt-32 w-[185px]">
          <CtaBtn
            size="M"
            level={fullName && email && companyName && country ? "P" : "D"}
            innerTxt="Next"
            onClickFnc={() => onClickNext()}
            disabled={!(fullName && email && companyName && country)}
          />
        </div>
      </div>
    </section>
  );
};

export default BusinessProfile;
