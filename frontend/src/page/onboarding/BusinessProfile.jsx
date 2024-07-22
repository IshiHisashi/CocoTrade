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
    <section className="relative min-h-screen w-screen flex flex-col justify-end">
      <div
        className="absolute top-0 min-h-screen w-screen blur-sm -z-10"
        style={{
          backgroundImage: `url(${image1})`,
          // backgroundSize: "cover",
          backgroundPosition: "90% 40%",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="w-full bg-white p-4 mt-32 filter-none">
        <div>
          <img src={progress1} alt="" aria-hidden className="mb-8" />
          <h1 className="h4-sans-uppercase text-neutral-600">
            BUSINESS PROFILE
          </h1>
        </div>

        <h2 className="h2-serif-normal sm:h2-serif text-neutral-600">
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
            infoText="Location will provide information on which currency will be used &#8212;currently our app is optimized only for Philippines"
          />
        </div>

        <div className="grid justify-end sm:mt-32">
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
